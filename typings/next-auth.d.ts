declare module 'next-auth' {
  import { DefaultSession, DefaultUser } from 'next-auth';

  export interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  export interface User extends DefaultUser {
    id: string;
  }

  export interface JWT {
    sub?: string;
  }
}