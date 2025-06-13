import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(20),
  AI_API_KEY: z.string().min(20),
  GCP_CREDENTIALS_JSON: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

export const config = {
  env: env.data.NODE_ENV,
  supabase: {
    url: env.data.SUPABASE_URL,
    anonKey: env.data.SUPABASE_ANON_KEY,
  },
  ai: {
    apiKey: env.data.AI_API_KEY,
    gcpCredentials: env.data.GCP_CREDENTIALS_JSON
      ? JSON.parse(env.data.GCP_CREDENTIALS_JSON)
      : undefined,
  },
  databaseUrl: env.data.DATABASE_URL,
  redis: {
    url: env.data.REDIS_URL,
  },
};