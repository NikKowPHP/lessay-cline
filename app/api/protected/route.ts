import { NextResponse } from 'next/server'
import { withAuthMiddleware } from '@/lib/auth-middleware'

async function handler() {
  return NextResponse.json({ message: 'Access granted to protected route' })
}

export const GET = withAuthMiddleware(handler)