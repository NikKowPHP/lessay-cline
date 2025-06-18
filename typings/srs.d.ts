declare module 'lib/srs' {
  export interface SRSEntry {
    id: string;
    userId: string;
    itemId: string;
    nextReview: Date;
    interval: number;
    ease: number;
  }

  export function getDueItems(userId?: string): Promise<SRSEntry[]>;
  export function updateSrsEntry(entryId: string, reviewResult: number): Promise<void>;
  export function scheduleNewItem(
    userId: string,
    itemId: string,
    initialEase?: number
  ): Promise<SRSEntry>;
}