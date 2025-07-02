import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET() {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user's subscription info from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        subscriptionId: true,
        stripeCustomerId: true 
      }
    });

    if (!userData?.stripeCustomerId || !userData?.subscriptionId) {
      return NextResponse.json({ 
        status: 'inactive',
        message: 'No active subscription found'
      });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      userData.subscriptionId
    );

    const firstItem = subscription.items.data[0];
    if (!firstItem?.plan) {
      throw new Error('Invalid subscription plan');
    }

    return NextResponse.json({
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      plan: {
        id: firstItem.plan.id,
        name: firstItem.plan.nickname || 'Unnamed Plan',
        amount: (firstItem.plan.amount || 0) / 100,
        interval: firstItem.plan.interval
      }
    });
  } catch (error) {
    console.error('Failed to fetch subscription details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}