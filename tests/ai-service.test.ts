import { describe, it, expect } from '@jest/globals'
import { analyzeAudioForDiagnostics } from '@/lib/ai-service'

describe('AI Service - Audio Analysis', () => {
  it('should return a fluency score', async () => {
    const result = await analyzeAudioForDiagnostics()
    expect(result.fluencyScore).toBeDefined()
    expect(result.fluencyScore).toBeGreaterThanOrEqual(0)
    expect(result.fluencyScore).toBeLessThanOrEqual(100)
  })

  it('should return a pronunciation accuracy score', async () => {
    const result = await analyzeAudioForDiagnostics()
    expect(result.pronunciationAccuracy).toBeDefined()
    expect(result.pronunciationAccuracy).toBeGreaterThanOrEqual(0)
    expect(result.pronunciationAccuracy).toBeLessThanOrEqual(100)
  })
})