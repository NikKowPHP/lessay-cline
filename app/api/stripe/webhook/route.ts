import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Stripe webhook received');
  return NextResponse.json({ received: true }, { status: 200 });
}