import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { generateLessonForUser } from '@/lib/ai-service';

export async function POST(request: Request) {
  const session = await getUserSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Generate lesson using AI service
  const generatedLesson = await generateLessonForUser(session.user.id);

  // Create lesson record in database
  const lesson = await prisma.lesson.create({
    data: {
      userId: session.user.id,
      content: generatedLesson.content
    }
  });

  // Create exercise record
  const exercise = await prisma.exercise.create({
    data: {
      lessonId: lesson.id,
      prompt: generatedLesson.exercise.prompt,
      correctAnswer: generatedLesson.exercise.correctAnswer
    }
  });

  // Create progress record
  const progress = await prisma.progress.create({
    data: {
      userId: session.user.id,
      lessonId: lesson.id,
      startedAt: new Date()
    }
  });

  return NextResponse.json({
    lessonId: lesson.id,
    exerciseId: exercise.id,
    progressId: progress.id
  });
}