import { NextResponse, NextRequest } from 'next/server'
import { getUserSession } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { errorHandler } from '@/lib/errorHandler'

export async function POST(req: NextRequest) {
  const session = await getUserSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        lesson: {
          create: {
            title: 'New Lesson',
            content: 'Lesson content',
            difficulty: 1
          }
        }
      },
      include: {
        lesson: true
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    return errorHandler(error as Error, req);
  }
}