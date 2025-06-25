// ROO-AUDIT-TAG :: FIX_PLAN.md :: Update profile route to use NextAuth sessions
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

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
  if (!body.targetLang || !body.nativeLang || !body.primaryGoal) {
    return NextResponse.json(
      { error: 'Required fields missing' },
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
      studyPreferences: body.studyPreferences || {}
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