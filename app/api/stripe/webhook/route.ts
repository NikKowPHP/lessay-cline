import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10'
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  if (!session.customer || typeof session.customer !== 'string') return;
  
  await prisma.user.update({
    where: { stripeCustomerId: session.customer },
    data: {
      subscriptionStatus: 'active',
      subscriptionId: session.subscription as string
    }
  });
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