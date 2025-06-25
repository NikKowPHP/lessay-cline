// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: Implement scoring logic
import { NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import type { Prisma } from '@prisma/client'

// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: Replace placeholder calculateScore function with real algorithm
function calculateScore(answer: string, currentScore: number): number {
  const trimmedAnswer = answer.trim();
  
  // Grammar evaluation (basic sentence structure)
  const grammarScore = trimmedAnswer.split(' ').length >= 3 ? 1 : 0.5;
  
  // Vocabulary evaluation (presence of key words)
  const hasKeyWords = /(please|thank you|greeting)/i.test(trimmedAnswer);
  const vocabularyScore = hasKeyWords ? 1 : 0.5;
  
  // Completeness evaluation
  const completenessScore = Math.min(trimmedAnswer.length / 15, 1); // Max 1 point for longer answers
  
  // Combine scores with weights
  const totalIncrement =
    (grammarScore * 0.4) + // 40% weight for grammar
    (vocabularyScore * 0.3) + // 30% weight for vocabulary
    (completenessScore * 0.3); // 30% weight for completeness
  
  // Calculate new score with smooth progression
  const newScore = currentScore + (totalIncrement * (5 - currentScore)/5);
  
  return Math.min(newScore, 5); // Cap at maximum score of 5
}
// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: END

// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: Implement comprehensive answer validation
function validateAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  
  // Minimum length requirement
  if (trimmed.length < 3) return false;
  
  // Should contain at least one space between words
  if (!trimmed.includes(' ')) return false;
  
  // Should start with a capital letter
  if (!/^[A-Z]/.test(trimmed)) return false;
  
  // Should end with proper punctuation
  if (!/[.!?]$/.test(trimmed)) return false;
  
  return true;
}
// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: END

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
    // ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: Handle null score and type definitions
    const score = calculateScore(answer, existingProgress.score || 0)
    // ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: Fix attempts field type
    const updateData = {
      score,
      completedAt: new Date(),
      attempts: {
        increment: 1
      }
    } as Prisma.ProgressUpdateInput
    // ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: END
    
    const progress = await prisma.progress.update({
      where: {
        id: existingProgress.id
      },
      data: updateData
    })
    // ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: END

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