import { createClient } from 'redis'
import { config } from './config'

const redisClient = createClient({
  url: config.redis.url
})

redisClient.on('error', (err) => console.error('Redis error:', err))

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  return redisClient
}

export async function cacheGet(key: string) {
  const client = await connectRedis()
  return client.get(key)
}

export async function cacheSet(key: string, value: string, ttl?: number) {
  const client = await connectRedis()
  if (ttl) {
    return client.setEx(key, ttl, value)
  }
  return client.set(key, value)
}