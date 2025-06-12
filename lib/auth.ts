/// <reference types="../typings/next-auth" />
import { NextAuthOptions, Session, User, JWT } from 'next-auth';
import SupabaseProvider from 'next-auth/supabase-provider';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const authOptions: NextAuthOptions = {
  providers: [
    SupabaseProvider({
      client: createClient(supabaseUrl, supabaseAnonKey),
      checkType: 'email',
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};