import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { sendSubscriptionConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
});

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  try {
    if (!sig) {
      throw new Error('Missing stripe signature');
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Check if we've already processed this event
    const processedEvent = await prisma.processedEvent.findUnique({
      where: { eventId: event.id }
    });
    if (processedEvent) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSession(session);
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePayment(invoice);
        break;

      default:
        logger.info(`Unhandled Stripe event type`, { eventType: event.type });
    }

    // Store the event ID after successful processing
    await prisma.$transaction([
      prisma.processedEvent.create({
        data: { eventId: event.id }
      })
    ]);
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    logger.error('Stripe webhook processing failed', { error: err });
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  if (!session.customer || typeof session.customer !== 'string') return;
  
  const user = await prisma.user.update({
    where: { stripeCustomerId: session.customer },
    data: {
      subscriptionStatus: 'active',
      subscriptionId: session.subscription as string
    }
  });
  
  if (user.email) {
    await sendSubscriptionConfirmation(user.email);
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  if (!invoice.customer || typeof invoice.customer !== 'string') return;

  await prisma.user.update({
    where: { stripeCustomerId: invoice.customer },
    data: {
      subscriptionCurrentPeriodEnd: new Date(invoice.period_end * 1000)
    }
  });
}