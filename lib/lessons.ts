import prisma from '@/lib/prisma';
import { cache } from './cache';
import type { Lesson } from '@prisma/client';

export async function getLessons(userId: string): Promise<Lesson[]> {
  const cacheKey = `lessons:${userId}`;
  const cached = await cache.get<Lesson[]>(cacheKey);
  if (cached) return cached;

  const lessons = await prisma.lesson.findMany({
    where: { userId },
    take: 10
  });

  await cache.set(cacheKey, lessons, 300);
  return lessons;
}

export async function startLesson(userId: string) {
  const lesson = await prisma.lesson.create({
    data: {
      title: 'New Lesson',
      content: 'Lesson content',
      difficulty: 1,
      userId,
      exercises: {
        create: [
          { 
            language: 'en',
            content: JSON.stringify({ question: 'Sample 1', options: [] }),
            type: 'multiple_choice',
            difficulty: 1,
            tags: 'beginner'
          },
          {
            language: 'en',
            content: JSON.stringify({ question: 'Sample 2', options: [] }),
            type: 'multiple_choice',
            difficulty: 1,
            tags: 'beginner'
          }
        ],
      },
    },
    include: { exercises: true },
  });

  return lesson;
}

export async function submitAnswer(exerciseId: string, answer: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise?.content) {
    throw new Error('Exercise not found or invalid');
  }

  const exerciseData = JSON.parse(exercise.content.toString());
  const isCorrect = exerciseData.answer === answer;
  
  return {
    correct: isCorrect,
    feedback: isCorrect ? 'Correct!' : 'Try again'
  };
}