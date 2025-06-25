// ROO-AUDIT-TAG :: FIX_PLAN.md :: Implement auth middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = [
  '/api/profile',
  '/api/settings',
  '/api/lessons',
  '/api/progress'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the current route is protected
  const isProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtected) {
    const token = await getToken({ req: request });
    
    if (!token) {
      const url = new URL('/api/auth/unauthorized', request.url);
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
// ROO-AUDIT-TAG :: FIX_PLAN.md :: END