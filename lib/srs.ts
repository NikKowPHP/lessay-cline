import { PrismaClient, SRSEntry } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Calculate the next review date based on the current ease factor and interval.
 * @param currentEase - The current ease factor (1.3-2.5)
 * @param interval - The current interval in days
 * @returns The next review date
 */
function calculateNextReviewDate(currentEase: number, interval: number): Date {
  // Simple algorithm: next review = today + (interval * ease factor)
  const today = new Date();
  return addDays(today, interval * currentEase);
}

/**
 * Update an SRS entry based on the review result.
 * @param entryId - The ID of the SRS entry to update
 * @param reviewResult - 0 (failed), 1-4 (passed with varying confidence)
 */
export async function updateSrsEntry(entryId: string, reviewResult: number) {
  const entry = await prisma.sRSEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry) {
    throw new Error('Entry not found');
  }

  let newEase: number;
  let newInterval: number;

  if (reviewResult === 0) {
    // Failed review
    newEase = Math.max(entry.ease - 0.15, 1.3);
    newInterval = Math.max(Math.floor(entry.interval / 2), 1);
  } else {
    // Passed review
    newEase = Math.min(entry.ease + 0.1, 2.5);
    newInterval = Math.max(Math.floor(entry.interval * 1.2), 1);

    if (reviewResult === 5) {
      // Perfect review
      newEase = Math.min(entry.ease + 0.2, 2.5);
      newInterval = Math.max(Math.floor(entry.interval * 1.5), 1);
    }
  }

  await prisma.sRSEntry.update({
    where: { id: entryId },
    data: {
      ease: newEase,
      interval: newInterval,
      nextReview: calculateNextReviewDate(newEase, newInterval),
    },
  });
}

/**
 * Get all SRS items due for review today.
 * @returns An array of SRS entries due today
 */
export async function getDueItems(): Promise<SRSEntry[]> {
  const today = new Date();
  return prisma.sRSEntry.findMany({
    where: {
      nextReview: {
        lte: today,
      },
    },
    orderBy: {
      nextReview: 'asc',
    },
  });
}

/**
 * Schedule a new SRS entry.
 * @param userId - The ID of the user
 * @param itemId - The ID of the vocabulary/grammar item
 * @param initialEase - The initial ease factor (default 2.5)
 * @returns The created SRS entry
 */
export async function scheduleNewItem(
  userId: string,
  itemId: string,
  initialEase: number = 2.5
): Promise<SRSEntry> {
  const initialInterval = 1; // Start with a 1-day interval
  const nextReview = calculateNextReviewDate(initialEase, initialInterval);

  return prisma.sRSEntry.create({
    data: {
      userId,
      itemId,
      ease: initialEase,
      interval: initialInterval,
      nextReview,
    },
  });
}