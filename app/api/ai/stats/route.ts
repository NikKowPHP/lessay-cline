// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Create AI stats endpoint
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
    // Get basic stats from database
    const lessonsGenerated = await prisma.lessonAttempt.count();
    const avgAccuracy = await prisma.lessonAttempt.aggregate({
      _avg: { overallScore: true }
    });

    return NextResponse.json({
      lessonsGenerated,
      avgAccuracy: avgAccuracy._avg.overallScore || 0,
      systemHealth: 'healthy' // TODO: Implement proper health checks
    });
  } catch (error) {
    console.error('Failed to fetch AI stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END