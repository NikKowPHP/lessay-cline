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
    // Get fluency stats from the database
    const fluencyStats = await prisma.lessonAttempt.aggregate({
      where: { userId: user.id },
      _avg: {
        fluencyScore: true
      },
      _count: {
        _all: true
      }
    });

    return NextResponse.json({
      avgFluencyScore: fluencyStats._avg.fluencyScore || 0,
      totalAttempts: fluencyStats._count._all || 0
    });
  } catch (error) {
    console.error('Failed to fetch fluency stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fluency stats' },
      { status: 500 }
    );
  }
}