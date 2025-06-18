import { db } from './db';
import { aiService } from './ai-service';
import { User, Lesson, Exercise } from '@prisma/client';
import { getUserProgress } from './progress';

/**
 * Generates a personalized lesson based on user progress
 * @param userId - The ID of the user
 * @returns A lesson object with exercises
 */
export async function generateLesson(userId: string): Promise<Lesson> {
  // Get user's current progress
  const progress = await getUserProgress(userId);

  // Generate lesson content using AI
  const content = await aiService.generateLessonContent(progress);

  // Create a new lesson in the database
  const newLesson = await db.lesson.create({
    data: {
      userId,
      title: 'Personalized Lesson',
      content,
      difficulty: progress.averageDifficulty + 1,
    },
  });

  // Generate exercises for this lesson
  const exercises = await generateExercises(newLesson.id, progress);

  return {
    ...newLesson,
    exercises,
  };
}

/**
 * Generates exercises for a lesson based on user progress
 * @param lessonId - The ID of the lesson
 * @param progress - The user's progress data
 * @returns An array of exercises
 */
async function generateExercises(lessonId: string, progress: any): Promise<Exercise[]> {
  // Generate exercise content using AI
  const exerciseData = await aiService.generateExercises(progress);

  // Create exercises in the database
  const exercises = await Promise.all(exerciseData.map((data, index) => {
    return db.exercise.create({
      data: {
        lessonId,
        type: data.type,
        content: data.content,
        difficulty: progress.averageDifficulty + index,
      },
    });
  }));

  return exercises;
}

/**
 * Gets the next exercise for a user based on their progress
 * @param userId - The ID of the user
 * @returns The next exercise
 */
export async function getNextExercise(userId: string): Promise<Exercise | null> {
  // Get user's current progress
  const progress = await getUserProgress(userId);

  // Find the next exercise based on progress
  const nextExercise = await db.exercise.findFirst({
    where: {
      lesson: { userId },
      difficulty: { gte: progress.averageDifficulty },
    },
    orderBy: { difficulty: 'asc' },
  });

  return nextExercise || null;
}