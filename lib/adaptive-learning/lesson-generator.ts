// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Create lesson generation algorithm
import { prisma } from '../prisma';
import { getDueReviews } from '../srs';

// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Enhance LessonPlan type
type LessonPlan = {
  reviewItems: string[];
  weakConcepts: string[];
  newMaterial: string[];
  difficulty: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  goalAlignment: number; // 1-5 scale
  estimatedDuration: number; // in minutes
};
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END

// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Enhance lesson generation with personalization
// ROO-AUDIT-TAG :: plan-009-lesson-structure.md :: Enhance lesson generator with params
export async function generateLessonPlan(
  userId: string,
  params?: {
    difficulty?: number;
    targetConcepts?: string[];
    language?: string;
  }
): Promise<LessonPlan> {
  // ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Fetch user data for personalization
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      learningStyle: true,
      targetLang: true,
      nativeLang: true,
      primaryGoal: true,
      secondaryGoals: true,
      comfortLevel: true
    }
  });
  // ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END

  // Get due SRS reviews
  const dueReviews = await getDueReviews(userId);
  const reviewItems = dueReviews.map(item => item.item);

  // Get user's weak points from recent lessons
  const weakConcepts = await getWeakConcepts(userId);

  // Select new material based on progress and goals
  let newMaterial = await selectNewMaterial(userId, {
    primary: user?.primaryGoal,
    secondary: user?.secondaryGoals
  });

  // Prioritize provided target concepts
  if (params?.targetConcepts?.length) {
    newMaterial = [...new Set([...params.targetConcepts, ...newMaterial])];
  }

  // Calculate overall difficulty with more factors
  let difficulty = await calculatePersonalizedDifficulty(userId, reviewItems.length, weakConcepts.length);
  // Use provided difficulty if available
  if (params?.difficulty) {
    difficulty = params.difficulty;
  }

  // Determine learning style (simplified for now)
  const learningStyle = 'visual'; // Temporarily hardcoded until migration is run

  // Calculate goal alignment score
  const goalAlignment = calculateGoalAlignment(newMaterial, {
    primary: user?.primaryGoal,
    secondary: user?.secondaryGoals
  });

  // Estimate duration based on content and user's average pace
  const estimatedDuration = estimateLessonDuration(reviewItems.length, weakConcepts.length, newMaterial.length);

  return {
    reviewItems,
    weakConcepts,
    newMaterial,
    difficulty,
    learningStyle,
    goalAlignment,
    estimatedDuration
  };
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END

async function getWeakConcepts(userId: string): Promise<string[]> {
  const analyses = await prisma.lessonAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Aggregate weak points from recent analyses
  const weakPoints = analyses.flatMap(a => a.weakPoints);
  const frequencyMap = new Map<string, number>();

  for (const point of weakPoints) {
    frequencyMap.set(point, (frequencyMap.get(point) || 0) + 1);
  }

  // Return top 3 most frequent weak points
  return Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([point]) => point);
}

// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Implement enhanced content pipeline
async function selectNewMaterial(userId: string, goals?: {primary?: string, secondary?: string[]}): Promise<string[]> {
  // Get user's highest mastered concepts
  const mastered = await prisma.sRSEntry.findMany({
    where: {
      userId,
      masteryLevel: { gte: 4 } // Mastery level 4 or 5
    },
    orderBy: { masteryLevel: 'desc' },
    take: 10
  });

  if (mastered.length === 0) {
    return ['basic_greetings', 'common_phrases']; // Default starter material
  }

  // Prioritize material aligned with user goals
  const goalKeywords = [
    goals?.primary?.toLowerCase().split(' ') || [],
    ...(goals?.secondary?.flatMap(g => g.toLowerCase().split(' ')) || [])
  ].flat();
  const prioritizedMaterial = knowledgeBase.filter(item =>
    goalKeywords.some(keyword => item.tags.includes(keyword))
  );

  // If no goal-aligned material, use general progression
  return prioritizedMaterial.length > 0
    ? prioritizedMaterial.slice(0, 3).map(item => item.concept)
    : mastered.map(item => `progression_${item.item.replace(' ', '_')}`);
}

// Simplified knowledge base representation
const knowledgeBase = [
  { concept: 'business_vocab', tags: ['work', 'professional', 'business'] },
  { concept: 'travel_phrases', tags: ['travel', 'vacation', 'directions'] },
  { concept: 'academic_writing', tags: ['study', 'university', 'writing'] },
  // ... more items
];
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END

// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Implement adaptive difficulty calculation
async function calculatePersonalizedDifficulty(userId: string, reviewCount: number, weakPointCount: number): Promise<number> {
  // Get user's recent performance
  const recentAttempts = await prisma.lessonAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const avgScore = recentAttempts.reduce((sum, a) => sum + (a.overallScore || 0), 0) / (recentAttempts.length || 1);
  const successRate = recentAttempts.filter(a => (a.overallScore || 0) >= 0.7).length / (recentAttempts.length || 1);

  // Base difficulty factors
  const totalWorkload = reviewCount + weakPointCount;
  let difficulty = 3; // Default medium difficulty
  
  if (totalWorkload > 8) difficulty = 5;
  else if (totalWorkload > 5) difficulty = 4;
  else if (totalWorkload > 3) difficulty = 3;
  else if (totalWorkload > 1) difficulty = 2;
  else difficulty = 1;

  // Adjust based on performance
  if (avgScore > 0.8 && successRate > 0.8) {
    difficulty = Math.min(difficulty + 1, 5);
  } else if (avgScore < 0.5 || successRate < 0.5) {
    difficulty = Math.max(difficulty - 1, 1);
  }

  return difficulty;
}

function calculateGoalAlignment(materials: string[], goals?: {primary?: string, secondary?: string[]}): number {
  if (!goals?.primary && !goals?.secondary?.length) return 3;
  
  const goalKeywords = [
    goals?.primary?.toLowerCase().split(' ') || [],
    ...(goals?.secondary?.flatMap(g => g.toLowerCase().split(' ')) || [])
  ].flat();
  const matchCount = materials.filter(m =>
    goalKeywords.some(kw => m.toLowerCase().includes(kw))
  ).length;
  
  return Math.min(Math.floor((matchCount / materials.length) * 5), 5);
}

function estimateLessonDuration(reviewCount: number, weakPointCount: number, newMaterialCount: number): number {
  // Base estimates on typical time spent per item type
  const reviewTime = reviewCount * 2; // 2 minutes per review
  const weakPointTime = weakPointCount * 5; // 5 minutes per weak point
  const newMaterialTime = newMaterialCount * 7; // 7 minutes per new concept
  return reviewTime + weakPointTime + newMaterialTime;
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END
// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END