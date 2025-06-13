import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export const cache = {
  get: async <T>(key: string): Promise<T | null> => await redis.get(key),
  set: async <T>(key: string, value: T, ttl: number) => 
    await redis.setex(key, ttl, value as unknown as string),
  del: async (key: string) => await redis.del(key)
}