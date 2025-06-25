// ROO-AUDIT-TAG :: plan-011-non-functional.md :: Implement Redis caching
import { createClient, type RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient: RedisClientType = createClient({ url: redisUrl });

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;