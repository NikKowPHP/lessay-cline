// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Create language analysis endpoint
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import { PostLessonAnalyzer } from '@/lib/adaptive-learning/analysis';
import type { LessonAttempt } from '@/types/lessons';

export async function POST(request: Request) {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const attemptData: LessonAttempt = await request.json();
    const analyzer = new PostLessonAnalyzer(attemptData);
    const analysis = analyzer.analyze();
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Language analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lesson attempt' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END