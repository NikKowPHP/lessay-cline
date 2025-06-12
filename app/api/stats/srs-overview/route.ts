import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const overview = await prisma.sRSEntry.groupBy({
    by: ['exerciseType'],
    where: { userId: session.user.id },
    _count: { status: true },
    _min: { nextReview: true },
    _max: { nextReview: true },
    _avg: { nextReview: true }
  });

  return NextResponse.json({ overview });
}