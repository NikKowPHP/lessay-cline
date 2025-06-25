import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

interface ProfileUpdateData {
  nativeLang: string;
  targetLang: string;
  primaryGoal: string;
  comfortLevel: number;
}

export async function POST(request: Request) {
  let userId: string | undefined;
  try {
    const data = await request.json();
    userId = data.userId;
    const { nativeLanguage, targetLanguage, primaryGoal, comfortLevel } = data;
    
    // Basic validation
    if (!userId || !nativeLanguage || !targetLanguage || !primaryGoal || !comfortLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare update data with correct types
    const updateData: ProfileUpdateData = {
      nativeLang: nativeLanguage,
      targetLang: targetLanguage,
      primaryGoal,
      comfortLevel: Number(comfortLevel)
    };

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json(updatedUser);
    
  } catch (error) {
    logger.error('Failed to create user profile', {
      error,
      userId: userId || 'unknown'
    });
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}