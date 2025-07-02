import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const languageSchema = z.object({
  targetLanguage: z.string().min(1, 'Target language is required'),
  nativeLanguage: z.string().min(1, 'Native language is required')
});

export async function POST(request: Request) {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate request body
    const validation = languageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Update user's language preferences
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        targetLang: validation.data.targetLanguage,
        nativeLang: validation.data.nativeLanguage
      },
      select: {
        targetLang: true,
        nativeLang: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update language preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update language preferences' },
      { status: 500 }
    );
  }
}