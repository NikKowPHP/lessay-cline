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

  logger.info({ userId: session.user.id }, 'Fetching SRS overview');

  try {
    const overview = await prisma.sRSEntry.groupBy({
      by: ['exerciseType'],
      where: { userId: session.user.id },
      _count: { status: true },
      _min: { nextReview: true },
      _max: { nextReview: true },
      _avg: { nextReview: true }
    });

    logger.debug({
      userId: session.user.id,
      entryCount: overview.length
    }, 'SRS overview retrieved successfully');

    return NextResponse.json({ overview });
  } catch (error) {
    logger.error({
      userId: session.user.id,
      error
    }, 'Failed to fetch SRS overview');
    
    return NextResponse.json(
      { error: 'Failed to retrieve SRS data' },
      { status: 500 }
    );
  }
}