import { AuthError, Session, SupabaseClient, User } from '@supabase/supabase-js';

let mockUser: User | null = null;
const mockSession: Session = {
  access_token: 'mock-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: {
    id: '123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  },
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

export const supabase: SupabaseClient = {
  auth: {
    signUp: jest.fn().mockImplementation(({ email, password }) => {
      if (email === 'test@example.com' && password === 'password123') {
        mockUser = {
          id: '123',
          email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };
        return Promise.resolve({ data: { user: mockUser }, error: null });
      }
      return Promise.resolve({ data: null, error: new AuthError('Signup failed', 400) });
    }),
    signInWithPassword: jest.fn().mockImplementation(({ email, password }) => {
      if (email === 'test@example.com' && password === 'password123') {
        mockUser = {
          id: '123',
          email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };
        return Promise.resolve({ data: { user: mockUser, session: mockSession }, error: null });
      }
      return Promise.resolve({ data: null, error: new AuthError('Invalid credentials', 401) });
    }),
    getUser: jest.fn().mockImplementation(() => {
      return Promise.resolve({ data: { user: mockUser }, error: null });
    }),
    signOut: jest.fn().mockImplementation(() => {
      mockUser = null;
      return Promise.resolve({ error: null });
    }),
    onAuthStateChange: jest.fn().mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: jest.fn() } }, error: null };
    }),
    getSession: jest.fn().mockImplementation(() => {
      return Promise.resolve({ data: { session: mockUser ? mockSession : null }, error: null });
    }),
  },
  supabaseUrl: 'http://mock.supabase.co',
  supabaseKey: 'mock-key',
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
  realtime: { channel: jest.fn() },
} as unknown as SupabaseClient;