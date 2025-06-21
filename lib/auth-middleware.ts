// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: Replace console.error with logger
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/supabase/server'
import { checkRateLimit, trackLoginAttempt } from '@/lib/security'
import logger from '@/lib/logger'

export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  
  // Check rate limit
  const rateLimitResponse = checkRateLimit(ip)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Track login attempt
  const attempt = trackLoginAttempt(ip)
  if (!attempt.allowed) {
    return NextResponse.json(
      { error: attempt.message },
      { status: 429 }
    )
  }

  const supabase = supabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    return await handler(req, user.id)
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error')
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function refreshSession() {
  const supabase = supabaseServerClient()
  const { data, error } = await supabase.auth.refreshSession()

  if (error) {
    throw error
  }

  return data
}

export async function withAuthMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    const rateLimitResponse = checkRateLimit(ip)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const supabase = supabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    // ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: END

    // Check if access token is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      try {
        const newSession = await refreshSession()
        if (!newSession?.session) {
          return NextResponse.json(
            { error: 'Session expired' },
            { status: 401 }
          )
        }
      } catch (err: unknown) {
        logger.error({ err }, 'Session refresh error')
        return NextResponse.json(
          { error: 'Failed to refresh session' },
          { status: 401 }
        )
      }
    }

    return handler(req)
  }
}