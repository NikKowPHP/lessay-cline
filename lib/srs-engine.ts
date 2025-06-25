// ROO-AUDIT-TAG :: plan-007-memory-system.md :: Implement SRS engine
type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5; // 0=worst, 5=best

export class SRSEngine {
  static calculateNextReview(currentEntry: {
    ease: number;
    interval: number;
    consecutiveCorrect: number;
    recallStrength: number;
  }, quality: ReviewQuality) {
    let { ease, interval, consecutiveCorrect, recallStrength } = currentEntry;
    
    // Adjust ease factor based on recall quality
    ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    
    // Calculate new interval
    if (quality < 3) {
      interval = 1;
      consecutiveCorrect = 0;
    } else {
      consecutiveCorrect += 1;
      if (consecutiveCorrect === 1) {
        interval = 1;
      } else if (consecutiveCorrect === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * ease);
      }
    }

    // Calculate new recall strength (0-1 scale)
    recallStrength = Math.min(1, Math.max(0, 
      recallStrength + (quality/5 - 0.2) * (1 - recallStrength)
    ));

    // Calculate mastery level based on consecutive correct
    const masteryLevel = Math.min(5, Math.floor(consecutiveCorrect / 3) + 1);

    // Calculate next review date (minimum 1 day, maximum 365 days)
    const daysUntilNext = Math.min(365, Math.max(1, interval));
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilNext);

    return {
      ease: Number(ease.toFixed(2)),
      interval,
      consecutiveCorrect,
      recallStrength: Number(recallStrength.toFixed(2)),
      masteryLevel,
      nextReview
    };
  }
}
// ROO-AUDIT-TAG :: plan-007-memory-system.md :: END