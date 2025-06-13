import { PostgreSqlContainer } from 'testcontainers';


const requiredEnvVariables = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'DATABASE_URL'];

requiredEnvVariables.forEach(variable => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

let container: typeof PostgreSqlContainer;

beforeAll(async () => {
  container = await new PostgreSqlContainer()
    .withExposedPorts(5432)
    .start();
  process.env.DATABASE_URL = container.getConnectionUri();
}, 60000);

afterAll(async () => {
  await container.stop();
});