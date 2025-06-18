#!/usr/bin/env node

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'REAUTH_SECRET',
  'GOOGLE_CLOUD_CREDENTIALS',
];

const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(', ')}`
  );
  process.exit(1);
} else {
  console.log('All required environment variables are set.');
}