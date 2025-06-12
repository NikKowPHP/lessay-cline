import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import logger from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil'
});

export async function POST(request: Request) {
  try {
    const { customerId, priceId } = await request.json();
    logger.info({ customerId, priceId }, 'Starting subscription creation');
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete'
    });

    logger.info({ subscriptionId: subscription.id }, 'Subscription created successfully');
    return NextResponse.json({ subscription });
  } catch (error) {
    logger.error({ error }, 'Failed to create subscription');
    return NextResponse.json(
      { error: 'Subscription creation failed' },
      { status: 500 }
    );
  }
}