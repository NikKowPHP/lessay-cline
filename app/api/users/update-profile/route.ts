
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  const { userId, nativeLang, targetLang } = await request.json();
  
  try {
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        nativeLang,
        targetLang
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to update user profile', {
      error,
      userId: userId,
      errorType: error instanceof Error ? error.constructor.name : typeof error
    });
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}