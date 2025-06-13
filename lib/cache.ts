import { Redis } from '@upstash/redis'

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error('Missing Redis configuration')
}

const redis: Redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    const result = await redis.get<string>(key)
    return result ? JSON.parse(result) as T : null
  },
  set: async <T>(key: string, value: T, ttl: number) => {
    await redis.setex(key, ttl, JSON.stringify(value))
  },
  del: async (key: string) => await redis.del(key)
}