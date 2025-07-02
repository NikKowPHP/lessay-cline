// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Create progress stats endpoint
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseServerClient } from '@/lib/supabase/server';
import redis from '@/lib/redis';

export async function GET() {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;

  const cacheKey = `user:${userId}:progress`;
  
  try {
    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
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

    // Store in cache with 1 hour expiration
    await redis.set(cacheKey, JSON.stringify(progressData), { EX: 3600 });
    
    return NextResponse.json(progressData);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END