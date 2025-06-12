import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function POST() {
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
    console.error('Lesson creation failed:', error)
    return NextResponse.json(
      { error: 'Lesson creation failed' },
      { status: 500 }
    )
  }
}