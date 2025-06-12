import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import logger from '@/lib/logger'

export async function GET() {
  const session = await getUserSession()
  
  if (!session) {
    logger.warn('Unauthorized profile access attempt');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  logger.info({ userId: session.user.id }, 'Fetching user profile');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      targetLang: true,
      nativeLang: true,
      createdAt: true
    }
  })

  if (!user) {
    logger.warn({ userId: session.user.id }, 'User profile not found');
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}

export async function PUT(request: Request) {
  const session = await getUserSession();
  
  if (!session) {
    logger.warn('Unauthorized profile update attempt');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  logger.info({ userId: session.user.id }, 'Updating user profile');

  const body = await request.json();
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        targetLang: body.targetLang,
        nativeLang: body.nativeLang
      },
      select: {
        id: true,
        email: true,
        targetLang: true,
        nativeLang: true,
        createdAt: true
      }
    });

    logger.debug({
      userId: session.user.id,
      updates: body
    }, 'Profile updated successfully');

    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error({
      userId: session.user.id,
      error,
      updateData: body
    }, 'Profile update failed');

    return NextResponse.json(
      { error: 'Profile update failed' },
      { status: 500 }
    );
  }
}