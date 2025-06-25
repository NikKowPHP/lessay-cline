// ROO-AUDIT-TAG :: FIX_PLAN.md :: Implement NextAuth.js configuration
// ROO-AUDIT-TAG :: FIX_PLAN.md :: Implement NextAuth.js configuration
// ROO-AUDIT-TAG :: FIX_PLAN.md :: Implement NextAuth.js configuration
// ROO-AUDIT-TAG :: FIX_PLAN.md :: Implement NextAuth.js configuration
import NextAuth, { type AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import type { DefaultSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configure authentication providers here
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Add any additional user properties from Prisma model as needed
      }
      return session;
    }
  },
  // ROO-AUDIT-TAG :: FIX_PLAN.md :: Implement session management
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // Update session daily
  },
  jwt: {
    maxAge: 60 * 60 // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
  // ROO-AUDIT-TAG :: FIX_PLAN.md :: END
};

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id: string;
    } & DefaultSession['user'];
  }
}

// ROO-AUDIT-TAG :: FIX_PLAN.md :: END

export default NextAuth(authOptions);