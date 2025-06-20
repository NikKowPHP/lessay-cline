import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10'
});

export async function POST(request: Request) {
  try {
    const { tier } = await request.json();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: getStripePriceId(tier), // You'll need to implement this function
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// Helper function to map tiers to Stripe price IDs
function getStripePriceId(tier: string): string {
  // Implement your tier to price ID mapping logic here
  switch(tier) {
    case 'premium':
      return 'price_premium_tier_id';
    case 'pro':
      return 'price_pro_tier_id';
    default:
      throw new Error('Invalid tier');
  }
}