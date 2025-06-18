# Lessay Development Phase 8: Testing Infrastructure

## Tasks for Developer AI

### 1. Install Testing Packages
- [x] **Add Jest and TypeScript support**
  ```bash
  npm install jest ts-jest @types/jest --save-dev
  ```
  Verification: Packages appear in `package.json` devDependencies

### 2. Configure Jest (`jest.config.ts`)
- [x] **Create Jest configuration**
  ```typescript
  import type { Config } from '@jest/types'

  const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1'
    }
  }

  export default config
  ```
  Verification: Configuration file exists with correct settings

### 3. Create Auth Tests (`/tests/auth.test.ts`)
- [x] **Implement authentication tests**
  ```typescript
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
  ```
  Verification: File exists with all test cases

### 4. Create Lesson Tests (`/tests/lessons.test.ts`)
- [x] **Implement lesson flow tests**
  ```typescript
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
  ```
  Verification: File exists with all test cases

### 5. Create AI Service Tests (`/tests/ai-service.test.ts`)
- [x] **Implement AI service tests**
  ```typescript
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
  ```
  Verification: File exists with all test cases

### 6. Create Dashboard Tests (`/tests/dashboard.test.ts`)
- [x] **Implement dashboard tests**
  ```typescript
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
  ```
  Verification: File exists with all test cases

### 7. Create Payment Tests (`/tests/payments.test.ts`)
- [x] **Implement payment tests**
  ```typescript
  import { describe, it, expect } from '@jest/globals'
  import { POST } from '@/app/api/payments/create-subscription/route'
  import { NextRequest } from 'next/server'

  // Mock the Stripe library
  const mockStripe = {
    subscriptions: {
      create: jest.fn()
    }
  }

  jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => mockStripe)
  })

  describe('Payment Processing - Subscription Creation', () => {
    it('should create a valid subscription', async () => {
      // Mock successful response
      mockStripe.subscriptions.create.mockResolvedValueOnce({
        id: 'sub_123',
        customer: 'cust_123',
        status: 'active',
        items: {
          data: [
            {
              price: {
                id: 'price_123'
              }
            }
          ]
        }
      })

      const request = new NextRequest(JSON.stringify({
        customerId: 'cust_123',
        priceId: 'price_123'
      }))

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.subscription).toBeDefined()
      expect(result.subscription.id).toBe('sub_123')
      expect(result.subscription.customer).toBe('cust_123')
      expect(result.subscription.items.data.length).toBeGreaterThan(0)
      expect(result.subscription.items.data[0].price.id).toBe('price_123')
    })

    it('should handle errors during subscription creation', async () => {
      // Mock error response
      mockStripe.subscriptions.create.mockRejectedValueOnce(new Error('Test error'))

      const request = new NextRequest(JSON.stringify({
        customerId: 'cust_123',
        priceId: 'price_123'
      }))

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.error).toBe('Subscription creation failed')
    })
  })
  ```
  Verification: File exists with all test cases

### 8. Update Package.json Scripts
- [x] **Add test command**
  ```json
  {
    "scripts": {
      "test": "jest"
    }
  }
  ```
  Verification: `npm test` runs Jest successfully

### 9. Update CI Workflow (`/.github/workflows/ci.yml`)
- [x] **Add testing step**
  ```yaml
  jobs:
    build-and-test:
      steps:
        - run: npm test
  ```
  Verification: CI file includes `npm test` command