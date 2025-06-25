// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Implement SRS scoring algorithm
import { prisma } from './prisma';

// ROO-AUDIT-TAG :: plan-010-srs-tracking.md :: Implement review session processing
import { SRSEngine, type ReviewQuality } from './srs-engine';

interface ReviewSessionResult {
  srsEntry: {
    id: string;
    ease: number;
    interval: number;
    nextReview: Date;
    recallStrength: number;
    masteryLevel: number;
    difficulty: number;
  };
  review: {
    id: string;
    score: number;
    reviewedAt: Date;
  };
}

type ReviewOutcome = {
  ease: number;
  interval: number;
  nextReview: Date;
  recallStrength: number;
  masteryLevel: number;
};

const MASTERY_THRESHOLDS = [0.3, 0.6, 0.8, 0.9, 0.95];

export async function calculateSrsScore(
  currentEase: number,
  currentInterval: number,
  currentRecallStrength: number,
  performance: number,
  consecutiveCorrect: number
): Promise<ReviewOutcome> {
  // Calculate recall strength (0-1 scale)
  const recallStrength = Math.min(1, currentRecallStrength +
    (performance * 0.2) - ((1 - performance) * 0.3));

  // Calculate mastery level based on recall strength
  const masteryLevel = MASTERY_THRESHOLDS.findIndex(
    t => recallStrength < t
  ) + 1;

  // Adjust ease factor based on performance
  let ease = currentEase;
  let interval = currentInterval;

  if (performance >= 0.9) {
    ease = Math.min(currentEase + 0.1 + (consecutiveCorrect * 0.02), 3.0);
    interval = currentInterval * ease * (1 + (recallStrength * 0.5));
  } else if (performance >= 0.7) {
    ease = currentEase;
    interval = currentInterval * 1.2 * (1 + (recallStrength * 0.3));
  } else {
    ease = Math.max(currentEase - 0.15 - ((1 - performance) * 0.1), 1.2);
    interval = 1;
  }

  // Apply minimum and maximum intervals
  interval = Math.max(1, Math.min(interval, 365));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + Math.round(interval));

  return {
    ease,
    interval,
    nextReview,
    recallStrength,
    masteryLevel
  };
}
export async function processReviewSession(
  entryId: string,
  quality: ReviewQuality,
  responseTimeMs: number
): Promise<ReviewSessionResult> {
  const entry = await prisma.sRSEntry.findUnique({
    where: { id: entryId }
  });

  if (!entry) {
    throw new Error('SRS entry not found');
  }

  // Calculate new SRS parameters using the engine
  const updateResult = SRSEngine.calculateNextReview({
    ease: entry.ease,
    interval: entry.interval,
    consecutiveCorrect: entry.consecutiveCorrect,
    recallStrength: entry.recallStrength,
    difficulty: entry.difficulty || 3 // Default to medium difficulty
  }, quality);

  // Update the SRS entry
  const updatedEntry = await prisma.sRSEntry.update({
    where: { id: entryId },
    data: {
      ease: updateResult.ease,
      interval: updateResult.interval,
      nextReview: updateResult.nextReview,
      recallStrength: updateResult.recallStrength,
      masteryLevel: updateResult.masteryLevel,
      consecutiveCorrect: updateResult.consecutiveCorrect,
      difficulty: updateResult.difficulty,
      lastReviewed: new Date()
    }
  });

  // Create review history record
  const review = await prisma.sRSReview.create({
    data: {
      srsEntryId: entryId,
      reviewedAt: new Date(),
      score: quality,
      responseTime: responseTimeMs,
      difficulty: updateResult.difficulty,
      interval: updateResult.interval,
      easeFactor: updateResult.ease
    }
  });

  return {
    srsEntry: updatedEntry,
    review: {
      id: review.id,
      score: review.score,
      reviewedAt: review.reviewedAt
    }
  };
}

export async function updateSrsEntry(
  entryId: string,
  performance: number,
  consecutiveCorrect: number
) {
  const entry = await prisma.sRSEntry.findUnique({
    where: { id: entryId }
  });

  if (!entry) return;

  // Convert performance score to ReviewQuality (0-5 scale)
  const quality = Math.round(performance * 5) as ReviewQuality;

  const updateResult = SRSEngine.calculateNextReview({
    ease: entry.ease,
    interval: entry.interval,
    consecutiveCorrect: entry.consecutiveCorrect,
    recallStrength: entry.recallStrength,
    difficulty: entry.difficulty || 3
  }, quality);

  await prisma.sRSEntry.update({
    where: { id: entryId },
    data: {
      ease: updateResult.ease,
      interval: updateResult.interval,
      nextReview: updateResult.nextReview,
      recallStrength: updateResult.recallStrength,
      masteryLevel: updateResult.masteryLevel,
      consecutiveCorrect: updateResult.consecutiveCorrect,
      difficulty: updateResult.difficulty
    }
  });
}


export async function getDueReviews(userId: string) {
  return prisma.sRSEntry.findMany({
    where: {
      userId,
      nextReview: {
        lte: new Date()
      }
    },
    orderBy: {
      nextReview: 'asc'
    }
  });
}
// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END