import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getUserSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { lessonId } = await request.json();

  // Check if progress already exists
  const existingProgress = await prisma.progress.findFirst({
    where: {
      userId: session.user.id,
      lessonId
    }
  });

  if (existingProgress) {
    // Update existing progress with new start time
    const progress = await prisma.progress.update({
      where: { id: existingProgress.id },
      data: { startedAt: new Date() }
    });
    return NextResponse.json(progress);
  }

  // Create new progress record
  const progress = await prisma.progress.create({
    data: {
      userId: session.user.id,
      lessonId,
      startedAt: new Date()
    }
  });

  return NextResponse.json(progress);
}