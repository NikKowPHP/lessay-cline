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
  const body = await request.json()
  console.log('Received profile update:', body)
  return NextResponse.json({ success: true })
}