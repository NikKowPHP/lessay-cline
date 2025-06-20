import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProfileUpdateData {
  nativeLang: string;
  targetLang: string;
  primaryGoal: string;
  comfortLevel: number;
}

export async function POST(request: Request) {
  try {
    const { userId, nativeLanguage, targetLanguage, primaryGoal, comfortLevel } = await request.json();
    
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
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}