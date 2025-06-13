import { describe, it, expect } from '@jest/globals'
import { startLesson, submitAnswer } from '@/lib/lessons'

describe('Lesson Flow', () => {
  it('should start a new lesson', async () => {
    const lesson = await startLesson('user_123')
    expect(lesson.exercises.length).toBeGreaterThan(0)
  })

  it('should accept correct answers', async () => {
    const response = await submitAnswer('ex_123', 'correct answer')
    expect(response.correct).toBe(true)
  })

  it('should provide feedback for incorrect answers', async () => {
    const response = await submitAnswer('ex_123', 'wrong answer')
    expect(response.correct).toBe(false)
    expect(response.feedback).toBeDefined()
  })
})