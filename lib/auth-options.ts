import NextAuth, { type AuthOptions, type Session, type User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configure authentication providers here
    // Example with GitHub:
    /*
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    */
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      session.user.id = user.id;
      return session;
    }
  }
};

export default NextAuth(authOptions);