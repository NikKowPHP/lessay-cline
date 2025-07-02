import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get total items count
    const totalItems = await prisma.sRSEntry.count({
      where: { userId: user.id }
    });

    // Get items due for review
    const dueForReview = await prisma.sRSEntry.count({
      where: {
        userId: user.id,
        nextReview: { lte: new Date() }
      }
    });

    // Get strength distribution
    const strengthDistribution = await prisma.sRSEntry.groupBy({
      by: ['masteryLevel'],
      where: { userId: user.id },
      _count: { _all: true }
    });

    return NextResponse.json({
      totalItems,
      dueForReview,
      strengthDistribution: strengthDistribution.reduce((acc, curr) => {
        acc[`level${curr.masteryLevel}`] = curr._count._all;
        return acc;
      }, {} as Record<string, number>)
    });
  } catch (error) {
    console.error('Failed to fetch SRS overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SRS overview' },
      { status: 500 }
    );
  }
}