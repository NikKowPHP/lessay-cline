import { describe, it, expect } from '@jest/globals'
import { getLessons } from '@/lib/lessons'

describe('Dashboard - Lesson Progress', () => {
  it('should return a valid list of lessons', async () => {
    const lessons = await getLessons('user_123')
    expect(lessons).toBeDefined()
    expect(lessons.length).toBeGreaterThan(0)
    expect(lessons[0]).toHaveProperty('id')
    expect(lessons[0]).toHaveProperty('title')
    expect(lessons[0]).toHaveProperty('difficulty')
  })
})