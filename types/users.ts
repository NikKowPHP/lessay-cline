// ROO-AUDIT-TAG :: plan-008-user-profile.md :: Define user profile types and validation
import { z } from 'zod';

export const UserProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  targetLang: z.string().min(2).max(10),
  nativeLang: z.string().min(2).max(10),
  primaryGoal: z.string().min(3).max(100),
  secondaryGoals: z.array(z.string().min(3).max(50)).max(5),
  comfortLevel: z.number().min(1).max(5),
  dailyTarget: z.number().min(5).max(120),
  role: z.enum(['USER', 'ADMIN', 'TUTOR']).optional().default('USER'),
  studyPreferences: z.object({
    darkMode: z.boolean().optional(),
    notifications: z.boolean().optional(),
    audioVolume: z.number().min(0).max(100).optional()
  }).optional()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
// ROO-AUDIT-TAG :: plan-008-user-profile.md :: END