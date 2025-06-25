// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Create progress stats endpoint
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const progressData = await prisma.lessonAttempt.groupBy({
      by: ['createdAt'],
      where: { userId },
      _avg: {
        phoneticScore: true,
        fluencyScore: true,
        grammarScore: true,
        vocabularyScore: true
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(progressData);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END