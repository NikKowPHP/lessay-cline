import { describe, it, expect } from '@jest/globals'
import { signUp, signIn } from '@/lib/auth'

describe('Authentication', () => {
  it('should allow valid user signup', async () => {
    const result = await signUp('test@example.com', 'password123')
    expect(result.success).toBe(true)
  })

  it('should reject duplicate user signup', async () => {
    await signUp('test@example.com', 'password123')
    const result = await signUp('test@example.com', 'password123')
    expect(result.error).toMatch(/already exists/i)
  })

  it('should allow valid login', async () => {
    await signUp('test@example.com', 'password123')
    const result = await signIn('test@example.com', 'password123')
    expect(result.success).toBe(true)
  })

  it('should reject invalid login', async () => {
    const result = await signIn('wrong@example.com', 'wrongpassword')
    expect(result.error).toMatch(/invalid credentials/i)
  })
})