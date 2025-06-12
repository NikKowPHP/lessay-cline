import { Provider } from 'next-auth/providers';

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

  export interface NextAuthOptions {
    providers: Provider[];
    secret?: string;
    session?: {
      strategy: 'jwt' | 'database';
    };
    callbacks?: {
      jwt?: (params: { token: JWT; user?: User }) => Promise<JWT>;
      session?: (params: { session: Session; token: JWT }) => Promise<Session>;
    };
  }
}