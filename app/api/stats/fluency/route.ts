import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await prisma.userProgress.groupBy({
    by: ['createdAt'],
    where: { userId: session.user.id },
    _avg: { accuracyScore: true },
    _count: { _all: true },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({ stats });
}