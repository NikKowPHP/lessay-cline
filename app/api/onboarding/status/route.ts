import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // TODO: Fetch real user ID from session
    const userId = 'temp-user-id'
    
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
      select: {
        welcomeComplete: true,
        tutorialComplete: true,
        profileSetupComplete: true
      }
    })

    return NextResponse.json(progress || {
      welcomeComplete: false,
      tutorialComplete: false,
      profileSetupComplete: false
    })
  } catch (error) {
    console.error('Onboarding status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    )
  }
}