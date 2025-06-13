import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const requiredEnvVariables = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'DATABASE_URL'];

requiredEnvVariables.forEach(variable => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});