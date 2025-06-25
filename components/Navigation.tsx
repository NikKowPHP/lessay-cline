// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Add admin navigation link
import Link from 'next/link'
import { getUserSession } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export default async function Navigation() {
  const session = await getUserSession()
  let isAdmin = false
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })
    isAdmin = user?.role === 'ADMIN'
  }
  
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </div>
        <div className="flex space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/profile" className="text-white hover:text-gray-300">
                Profile
              </Link>
              {isAdmin && (
                <Link href="/ai-monitor" className="text-white hover:text-gray-300">
                  AI Monitor
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}