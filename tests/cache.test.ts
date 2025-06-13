import { cache } from '../lib/cache'

describe('Redis Cache', () => {
  const testKey = 'testKey'
  const testValue = { data: 'testValue' }
  const ttl = 5 // 5 seconds

  afterEach(async () => {
    await cache.del(testKey)
  })

  test('should set and get value correctly', async () => {
    await cache.set(testKey, testValue, ttl)
    const result = await cache.get<typeof testValue>(testKey)
    expect(result).toEqual(testValue)
  })

  test('should return null for non-existent key', async () => {
    const result = await cache.get(testKey)
    expect(result).toBeNull()
  })

  test('should delete key correctly', async () => {
    await cache.set(testKey, testValue, ttl)
    await cache.del(testKey)
    const result = await cache.get(testKey)
    expect(result).toBeNull()
  })

  test('should respect TTL', async () => {
    await cache.set(testKey, testValue, ttl)
    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, (ttl + 1) * 1000))
    const result = await cache.get(testKey)
    expect(result).toBeNull()
  }, (ttl + 2) * 1000) // Set longer timeout for this test
})