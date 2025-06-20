
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

declare const prisma: {
  user: {
    update: (params: {
      where: { id: string };
      data: { nativeLang: string; targetLang: string };
    }) => Promise<void>;
  };
};

export async function POST(request: Request) {
  try {
    const { userId, nativeLang, targetLang } = await request.json();
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        nativeLang,
        targetLang
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}