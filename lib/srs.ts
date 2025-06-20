import { prisma } from './prisma';

type ReviewOutcome = {
  ease: number;
  interval: number;
  nextReview: Date;
};

export async function calculateSrsScore(
  currentEase: number,
  currentInterval: number,
  performance: number
): Promise<ReviewOutcome> {
  let ease = currentEase;
  let interval = currentInterval;

  if (performance >= 0.9) {
    ease = Math.min(currentEase + 0.15, 2.5);
    interval = currentInterval * ease;
  } else if (performance >= 0.7) {
    ease = currentEase;
    interval = currentInterval * 1.5;
  } else {
    ease = Math.max(currentEase - 0.2, 1.3);
    interval = 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + Math.round(interval));

  return { ease, interval, nextReview };
}

export async function updateSrsEntry(
  entryId: string,
  performance: number
) {
  const entry = await prisma.sRSEntry.findUnique({
    where: { id: entryId }
  });

  if (!entry) return;

  const { ease, interval, nextReview } = await calculateSrsScore(
    entry.ease,
    entry.interval,
    performance
  );

  await prisma.sRSEntry.update({
    where: { id: entryId },
    data: {
      ease,
      interval,
      nextReview
    }
  });
}