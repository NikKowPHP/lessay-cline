import { AuthError } from '@supabase/supabase-js';

import { SupabaseClient } from '@supabase/supabase-js';

export const supabase: SupabaseClient = {
  auth: {
    signUp: jest.fn().mockImplementation(({ email }) => {
      if (email === 'test@example.com') {
        return Promise.resolve({ data: { user: { id: '123' } }, error: null });
      }
      return Promise.resolve({ data: null, error: new AuthError('User already exists', 400) });
    }),
    signInWithPassword: jest.fn().mockImplementation(({ email, password }) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({ data: { user: { id: '123' } }, error: null });
      }
      return Promise.resolve({ data: null, error: new AuthError('Invalid credentials', 401) });
    }),
  },
  supabaseUrl: 'http://mock.supabase.co',
  supabaseKey: 'mock-key',
  // Add other required properties with mock implementations
  // @ts-ignore - We're only mocking the methods we need for tests
  from: () => ({ select: jest.fn() }),
  // @ts-ignore
  realtime: { channel: jest.fn() },
} as unknown as SupabaseClient;