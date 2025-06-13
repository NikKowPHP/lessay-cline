/// <reference types="../typings/next-auth" />
import { NextAuthOptions, Session, JWT } from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authOptions: NextAuthOptions = {
  providers: [
    SupabaseAdapter({
      supabase,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
}
