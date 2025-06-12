import { NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  logger.info({ lessonId: params.id, answer: body }, 'Received answer submission')
  return NextResponse.json({ correct: true })
}