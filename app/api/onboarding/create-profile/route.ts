import { NextResponse } from 'next/server';
import getServerSession from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { targetLang, nativeLang, primaryGoal } = await request.json();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        targetLang,
        nativeLang,
        primaryGoal,
        status: 'active'
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}