import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const supabase = supabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lessonId } = await request.json();
    
    // Check if progress already exists
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: user.id,
        lessonId
      }
    });

    if (existingProgress) {
      return NextResponse.json(existingProgress);
    }

    // Create new progress record
    const progress = await prisma.progress.create({
      data: {
        userId: user.id,
        lessonId,
        startedAt: new Date()
      }
    });

    return NextResponse.json(progress);
  } catch (err) {
    console.error('Error starting lesson:', err);
    return NextResponse.json(
      { error: 'Failed to start lesson' },
      { status: 500 }
    );
  }
}