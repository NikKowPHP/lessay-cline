// ROO-AUDIT-TAG :: plan-009-lesson-structure.md :: Enhance lesson generation endpoint
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { generateLessonPlan } from '@/lib/adaptive-learning/lesson-generator';
import { z } from 'zod';

const GenerateLessonSchema = z.object({
  difficulty: z.number().min(1).max(5).optional(),
  targetConcepts: z.array(z.string()).optional(),
  language: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestBody = await request.json();
    const params = GenerateLessonSchema.parse(requestBody);

    const lessonPlan = await generateLessonPlan(session.user.id, {
      difficulty: params.difficulty,
      targetConcepts: params.targetConcepts,
      language: params.language,
    });

    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error('Lesson generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson plan' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-009-lesson-structure.md :: END