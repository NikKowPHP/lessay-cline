import dotenv from 'dotenv';
import { config } from '../lib/config';

dotenv.config({ path: '.env.test' });

if (!config.supabase.url) {
  throw new Error('Supabase URL is required for tests');
}

if (!config.supabase.url.includes('test')) {
  throw new Error('Tests must use test Supabase URL');
}