import { prisma } from './prisma';

type LessonResult = {
  lessonId: string;
  userId: string;
  responses: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    pronunciationScore?: number;
  }>;
};

export async function analyzeLesson(results: LessonResult) {
  const totalQuestions = results.responses.length;
  const correctAnswers = results.responses.filter(r => 
    r.userAnswer.toLowerCase() === r.correctAnswer.toLowerCase()
  ).length;
  const accuracy = correctAnswers / totalQuestions;

  const pronunciationScores = results.responses
    .map(r => r.pronunciationScore)
    .filter((s): s is number => s !== undefined);
  const averagePronunciation = pronunciationScores.length > 0 
    ? pronunciationScores.reduce((a, b) => a + b, 0) / pronunciationScores.length
    : null;

  const weakPoints = results.responses
    .filter(r => r.userAnswer.toLowerCase() !== r.correctAnswer.toLowerCase())
    .map(r => r.question);

  const analysis = await prisma.lessonAnalysis.create({
    data: {
      lessonId: results.lessonId,
      userId: results.userId,
      accuracy,
      pronunciationScore: averagePronunciation,
      weakPoints: {
        set: weakPoints
      }
    }
  });

  return analysis;
}