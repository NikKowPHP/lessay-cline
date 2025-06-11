import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ id: 'user_123' })
}

export async function PUT(request: Request) {
  const body = await request.json()
  console.log('Received profile update:', body)
  return NextResponse.json({ success: true })
}