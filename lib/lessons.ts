import prisma from '@/lib/prisma';

export async function startLesson(userId: string) {
  const lesson = await prisma.lesson.create({
    data: {
      userId,
      exercises: {
        create: [
          { question: 'Sample question 1', answer: 'correct answer' },
          { question: 'Sample question 2', answer: 'correct answer' },
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

  if (!exercise) {
    throw new Error('Exercise not found');
  }

  const isCorrect = exercise.answer === answer;
  const feedback = isCorrect ? 'Well done!' : 'Try again!';

  return {
    correct: isCorrect,
    feedback,
  };
}