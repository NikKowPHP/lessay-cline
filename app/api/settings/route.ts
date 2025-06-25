import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import type { Session } from 'next-auth';

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email: body.email,
        // Note: In a real application, we'd hash the password before saving
        ...(body.newPassword && { password: body.newPassword }),
        notificationPreferences: {
          update: {
            email: body.notifications
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to update user settings', {
      error,
      userId: session.user.id,
      errorType: error instanceof Error ? error.constructor.name : typeof error
    });
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}