import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserSession } from '@/lib/supabase/server'
import logger from '@/lib/logger'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getUserSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const startTime = Date.now()
  logger.info({ userId: session.user.id, lessonId: params.id }, 'Submitting answer')

  try {
    const { answer } = await request.json()
    const lessonId = params.id

    // First find the progress record
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        lessonId: lessonId
      }
    })

    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progress record not found' },
        { status: 404 }
      )
    }

    // Update progress with the submitted answer
    const progress = await prisma.progress.update({
      where: {
        id: existingProgress.id
      },
      data: {
        completedAt: new Date(),
        lesson: {
          update: {
            content: JSON.stringify({ answer })
          }
        }
      },
      include: {
        lesson: true
      }
    })

    const endTime = Date.now()
    const responseTime = endTime - startTime
    logger.info({ userId: session.user.id, lessonId: params.id, responseTime }, 'Answer submitted successfully')

    return NextResponse.json({
      success: true,
      progress
    })
  } catch (error) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    logger.error({ userId: session.user.id, lessonId: params.id, responseTime, error }, 'Answer submission failed')
    return NextResponse.json(
      { error: 'Answer submission failed' },
      { status: 500 }
    )
  }
}