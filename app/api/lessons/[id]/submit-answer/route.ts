import { NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = supabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { answer } = await request.json()
    const lessonId = params.id

    // Find the progress record first
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: user.id,
        lessonId
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
        score: 1, // Placeholder score, adjust as needed
        completedAt: new Date()
      }
    })

    // Simple answer validation - could be expanded with actual validation logic
    const isValid = answer.trim().length > 0

    return NextResponse.json({
      correct: isValid,
      progress
    })
  } catch (err) {
    console.error('Error submitting answer:', err)
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}