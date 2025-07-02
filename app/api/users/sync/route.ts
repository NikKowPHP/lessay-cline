import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import { sendWelcomeEmail } from '@/lib/email'

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
      await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { id: user.id }
        })
        
        if (!existingUser) {
          const newUser = await tx.user.create({
            data: {
              id: user.id,
              email: user.email!,
              password: '',
              targetLang: 'en',
              nativeLang: 'en',
              primaryGoal: 'general',
              comfortLevel: 1
            }
          })
          await sendWelcomeEmail(newUser.email, newUser.name || 'User')
          return newUser
        } else {
          return tx.user.update({
            where: { id: user.id },
            data: { email: user.email }
          })
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