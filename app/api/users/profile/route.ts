// ROO-AUDIT-TAG :: FIX_PLAN.md :: Update profile route to use NextAuth sessions
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// ROO-AUDIT-TAG :: plan-008-user-profile.md :: Implement Zod validation
const profileSchema = z.object({
  name: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  targetLang: z.string().min(1, 'Target language is required'),
  nativeLang: z.string().min(1, 'Native language is required'),
  primaryGoal: z.string().min(1, 'Primary goal is required'),
  secondaryGoals: z.array(z.string()).optional(),
  comfortLevel: z.number().min(1).max(5).default(3),
  dailyTarget: z.number().min(5).max(240).default(15),
  studyPreferences: z.record(z.any()).optional(),
  memoryRetentionRate: z.number().min(0).max(1).default(0.7),
  preferredReviewTime: z.enum(['morning', 'afternoon', 'evening']).default('morning')
});
// ROO-AUDIT-TAG :: plan-008-user-profile.md :: END

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      targetLang: true,
      nativeLang: true,
      primaryGoal: true,
      secondaryGoals: true,
      comfortLevel: true,
      dailyTarget: true,
      studyPreferences: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Basic validation
  try {
    profileSchema.parse(body);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Unknown validation error' },
      { status: 400 }
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      avatarUrl: body.avatarUrl,
      targetLang: body.targetLang,
      nativeLang: body.nativeLang,
      primaryGoal: body.primaryGoal,
      secondaryGoals: body.secondaryGoals || [],
      comfortLevel: body.comfortLevel || 3,
      dailyTarget: body.dailyTarget || 15,
      studyPreferences: body.studyPreferences || {},
      memoryRetentionRate: body.memoryRetentionRate,
      preferredReviewTime: body.preferredReviewTime
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      targetLang: true,
      nativeLang: true,
      primaryGoal: true,
      secondaryGoals: true,
      comfortLevel: true,
      dailyTarget: true,
      studyPreferences: true,
      updatedAt: true
    }
  });

  return NextResponse.json(updatedUser);
}
// ROO-AUDIT-TAG :: FIX_PLAN.md :: END