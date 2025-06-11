import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { tier } = await request.json();
  console.log('Creating subscription for tier:', tier);
  return NextResponse.json({ status: 'active' });
}