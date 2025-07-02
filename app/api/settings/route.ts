import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function POST(req: Request) {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
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
      userId: user.id,
      errorType: error instanceof Error ? error.constructor.name : typeof error
    });
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}