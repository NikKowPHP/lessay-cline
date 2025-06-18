import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-lg font-semibold">
            <Link href="/">Lessay</Link>
          </div>
          <nav className="space-x-4">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/lessons">Lessons</Link>
            <Link href="/pricing">Pricing</Link>
            {session ? (
              <>
                <span>Welcome, {session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 px-2 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-200 text-gray-700 py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Lessay. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;