import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }

  try {
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
        },
        create: {
          id: user.id,
          email: user.email!,
          password: '', // Empty string since we don't store auth passwords
          targetLang: 'en', // Default target language
          nativeLang: 'en', // Default native language
          primaryGoal: 'general', // Default learning goal
          comfortLevel: 1 // Default comfort level (1 = beginner)
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to sync users', {
      error,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      userCount: users?.length || 0
    })
    return NextResponse.json(
      { error: 'User sync failed' },
      { status: 500 }
    )
  }
}