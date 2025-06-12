declare module '@auth/supabase-adapter' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export function SupabaseAdapter(options: {
    supabase: SupabaseClient;
  }): any;
}