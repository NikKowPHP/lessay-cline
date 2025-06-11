import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  console.log(`Received answer for lesson ${params.id}:`, body)
  return NextResponse.json({ correct: true })
}