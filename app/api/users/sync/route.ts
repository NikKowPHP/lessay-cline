import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
          nativeLang: 'en' // Default native language
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User sync failed:', error)
    return NextResponse.json(
      { error: 'User sync failed' },
      { status: 500 }
    )
  }
}