import { NextResponse, NextRequest } from 'next/server'
import { getUserSession } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { errorHandler } from '@/lib/errorHandler'
import logger from '@/lib/logger'

export async function POST(req: NextRequest) {
  const session = await getUserSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const startTime = Date.now()
  logger.info({ userId: session.user.id }, 'Starting new lesson')

  try {
    const lesson = await prisma.lesson.create({
      data: {
        userId: session.user.id,
        title: 'New Lesson',
        content: 'Lesson content',
        difficulty: 1
      }
    })

    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        lessonId: lesson.id
      }
    })

    const endTime = Date.now()
    const responseTime = endTime - startTime
    logger.info({ userId: session.user.id, responseTime }, 'Lesson started successfully')

    return NextResponse.json({ progress, lesson })
  } catch (error) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    logger.error({ userId: session.user.id, responseTime, error }, 'Failed to start lesson')
    return errorHandler(error as Error, req)
  }
}