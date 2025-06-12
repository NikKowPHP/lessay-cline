import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { generateLessonForUser } from '@/lib/ai-service';
import logger from '@/lib/logger';

export async function POST() {
  const session = await getUserSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  logger.info({ userId: session.user.id }, 'Starting lesson generation');

  // Generate lesson using AI service
  let generatedLesson;
  try {
    generatedLesson = await generateLessonForUser(session.user.id);
    logger.debug({ userId: session.user.id }, 'AI lesson generated successfully');
  } catch (error) {
    logger.error({ userId: session.user.id, error }, 'Failed to generate lesson');
    return NextResponse.json(
      { error: 'Lesson generation failed' },
      { status: 500 }
    );
  }

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

  logger.info({
    userId: session.user.id,
    lessonId: lesson.id,
    exerciseId: exercise.id,
    progressId: progress.id
  }, 'Lesson created successfully');

  return NextResponse.json({
    lessonId: lesson.id,
    exerciseId: exercise.id,
    progressId: progress.id
  });
}