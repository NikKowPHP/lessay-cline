// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: Implement scoring logic
import { NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

function calculateScore(answer: string, currentScore: number): number {
  // Basic scoring - could be enhanced with AI analysis
  const answerLength = answer.trim().length
  const lengthScore = Math.min(answerLength / 10, 1) // Max 1 point for length
  const correctnessScore = answer.includes(' ') ? 0.5 : 0 // Simple heuristic
  return Math.min(currentScore + lengthScore + correctnessScore, 5) // Cap at 5
}

function validateAnswer(answer: string): boolean {
  // Basic validation - could be enhanced
  return answer.trim().length >= 3
}

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
    const score = calculateScore(answer, existingProgress.score)
    const progress = await prisma.progress.update({
      where: {
        id: existingProgress.id
      },
      data: {
        score,
        completedAt: new Date(),
        attempts: {
          increment: 1
        }
      }
    })

    // Validate answer (basic implementation)
    const isValid = validateAnswer(answer)

    return NextResponse.json({
      correct: isValid,
      progress
    })
  } catch (err) {
    logger.error({ err }, 'Error submitting answer')
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}
// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: END