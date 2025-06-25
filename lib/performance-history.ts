// ROO-AUDIT-TAG :: plan-007-memory-system.md :: Implement performance history module
import { prisma } from './prisma';

export class PerformanceHistory {
  static async recordSession(userId: string, metrics: {
    duration: number;
    itemsReviewed: number;
    accuracy: number;
    newItems: number;
  }) {
    await prisma.studySession.create({
      data: {
        userId,
        duration: metrics.duration,
        itemsReviewed: metrics.itemsReviewed,
        accuracy: metrics.accuracy,
        newItems: metrics.newItems,
      }
    });
  }

  static async getHistoricalProgress(userId: string, period: 'week' | 'month' | 'year') {
    const now = new Date();
    const startDate = new Date(now);
    
    switch(period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return prisma.studySession.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async createProgressSnapshot(userId: string) {
    const currentProgress = await prisma.userProgress.findMany({
      where: { userId }
    });
    
    return prisma.progressSnapshot.create({
      data: {
        userId,
        snapshot: JSON.stringify(currentProgress),
      }
    });
  }
}
// ROO-AUDIT-TAG :: plan-007-memory-system.md :: END