import Link from 'next/link'
import { getUserSession } from '@/lib/supabase/server'

export default async function Navigation() {
  const session = await getUserSession()
  
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