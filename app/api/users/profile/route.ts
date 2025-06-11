import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getUserSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

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
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update failed:', error);
    return NextResponse.json(
      { error: 'Profile update failed' },
      { status: 500 }
    );
  }
}