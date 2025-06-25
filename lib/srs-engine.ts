// ROO-AUDIT-TAG :: plan-010-srs-tracking.md :: Implement enhanced SRS scheduling algorithm
type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5; // 0=worst, 5=best

interface SRSItem {
  ease: number;
  interval: number;
  consecutiveCorrect: number;
  recallStrength: number;
  difficulty: number; // 1-5 scale
}

interface SRSUpdateResult {
  ease: number;
  interval: number;
  consecutiveCorrect: number;
  recallStrength: number;
  masteryLevel: number;
  nextReview: Date;
  difficulty: number;
}

const MASTERY_THRESHOLDS = [0.3, 0.6, 0.8, 0.9, 0.95];
const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 3.0;

export class SRSEngine {
  static calculateNextReview(currentItem: SRSItem, quality: ReviewQuality): SRSUpdateResult {
    let { ease, interval, consecutiveCorrect, recallStrength, difficulty } = currentItem;
    
    // Adjust difficulty based on performance (weighted moving average)
    difficulty = (difficulty * 0.7) + ((5 - quality) * 0.3);
    difficulty = Math.max(1, Math.min(5, Number(difficulty.toFixed(1))));
    
    // Calculate performance-adjusted ease factor
    const easeAdjustment = this.calculateEaseAdjustment(quality, difficulty);
    ease = Math.max(MIN_EASE_FACTOR, Math.min(MAX_EASE_FACTOR, ease + easeAdjustment));
    
    // Update consecutive correct count and reset interval if needed
    if (quality >= 3) {
      consecutiveCorrect += 1;
    } else {
      consecutiveCorrect = 0;
      interval = 1;
    }

    // Calculate new interval based on performance and difficulty
    if (consecutiveCorrect > 0) {
      interval = this.calculateNextInterval(
        interval,
        ease,
        consecutiveCorrect,
        difficulty
      );
    }

    // Update recall strength using exponential moving average
    recallStrength = this.calculateRecallStrength(recallStrength, quality);

    // Calculate mastery level based on recall strength thresholds
    const masteryLevel = MASTERY_THRESHOLDS.findIndex(t => recallStrength < t) + 1;

    // Calculate next review date with jitter to avoid pile-ups
    const nextReview = this.calculateNextReviewDate(interval);

    return {
      ease: Number(ease.toFixed(2)),
      interval,
      consecutiveCorrect,
      recallStrength: Number(recallStrength.toFixed(2)),
      masteryLevel,
      nextReview,
      difficulty: Number(difficulty.toFixed(1))
    };
  }

  private static calculateEaseAdjustment(quality: ReviewQuality, difficulty: number): number {
    const qualityFactor = (quality - 2.5) / 10; // Normalize to -0.25 to +0.25
    const difficultyFactor = (3 - difficulty) / 20; // Easier items get slightly bigger boosts
    return qualityFactor + difficultyFactor;
  }

  private static calculateNextInterval(
    currentInterval: number,
    ease: number,
    consecutiveCorrect: number,
    difficulty: number
  ): number {
    if (consecutiveCorrect === 1) return 1;
    if (consecutiveCorrect === 2) return 6;
    
    // Base interval with difficulty scaling
    let interval = currentInterval * ease * (1 + (1 - (difficulty / 5)));
    
    // Apply graduated interval increases for higher mastery
    if (consecutiveCorrect > 5) {
      interval *= 1.2;
    }
    if (consecutiveCorrect > 10) {
      interval *= 1.1;
    }

    return Math.max(1, Math.min(Math.round(interval), 365));
  }

  private static calculateRecallStrength(current: number, quality: ReviewQuality): number {
    const target = quality / 5;
    return current + (target - current) * 0.3; // 30% weight to new observation
  }

  private static calculateNextReviewDate(intervalDays: number): Date {
    // Add jitter (+/- 10%) to avoid review pile-ups
    const jitter = intervalDays * 0.2 * (Math.random() - 0.5);
    const daysUntilNext = Math.max(1, Math.min(365, intervalDays + jitter));
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + Math.round(daysUntilNext));
    return nextReview;
  }
}
// ROO-AUDIT-TAG :: plan-010-srs-tracking.md :: END