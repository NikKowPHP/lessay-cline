import { PrismaClient } from '@prisma/client';
import { config } from './config';
import logger from './logger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
});

export async function verifyDbConnection(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection verified');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw new Error('Unable to connect to database. Please check your database configuration.');
  }
}

export async function disconnectDb(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error disconnecting from database', error);
  }
}

export default prisma;