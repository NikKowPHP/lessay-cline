import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Require re-authentication
  const reauth = req.headers.get('x-reauth-token');
  if (!reauth || reauth !== process.env.REAUTH_SECRET) {
    return NextResponse.json(
      { error: 'Re-authentication required' },
      { status: 401 }
    );
  }

  try {
    // Delete all user-related data
    await prisma.$transaction(async (tx) => {
      // Delete user progress
      await tx.userProgress.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete voice analyses
      await tx.voiceAnalysis.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete user
      await tx.user.delete({
        where: { id: session.user.id },
      });
    });

    // Clear any cached data
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}