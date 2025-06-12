import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    logger.warn('Unauthorized access attempt to fluency stats');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  logger.info({ userId: session.user.id }, 'Fetching fluency stats');

  try {
    const stats = await prisma.userProgress.groupBy({
      by: ['createdAt'],
      where: { userId: session.user.id },
      _avg: { accuracyScore: true },
      _count: { _all: true },
      orderBy: { createdAt: 'asc' }
    });

    logger.debug({ userId: session.user.id, statsCount: stats.length }, 'Fluency stats retrieved');
    return NextResponse.json({ stats });
  } catch (error) {
    logger.error({ userId: session.user.id, error }, 'Failed to fetch fluency stats');
    return NextResponse.json(
      { error: 'Failed to retrieve fluency stats' },
      { status: 500 }
    );
  }
}