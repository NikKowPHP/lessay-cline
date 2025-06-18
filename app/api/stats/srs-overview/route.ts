import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    logger.warn('Unauthorized access attempt to SRS overview');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  logger.info({ userId: session.user.id }, 'Fetching SRS overview');

  try {
    const overview = await prisma.progress.groupBy({
      by: ['lessonId'],
      where: { userId: session.user.id },
      _count: true
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    logger.info({ userId: session.user.id, responseTime }, 'SRS overview retrieved successfully');

    return NextResponse.json({ overview });
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    logger.error({ userId: session.user.id, responseTime, error }, 'Failed to fetch SRS overview');

    return NextResponse.json(
      { error: 'Failed to retrieve SRS data' },
      { status: 500 }
    );
  }
}