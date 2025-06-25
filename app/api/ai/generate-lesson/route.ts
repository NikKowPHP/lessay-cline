// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Create lesson generation endpoint
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { generateLessonPlan } from '@/lib/adaptive-learning/lesson-generator';

export async function POST() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const lessonPlan = await generateLessonPlan(session.user.id);
    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error('Lesson generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson plan' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END