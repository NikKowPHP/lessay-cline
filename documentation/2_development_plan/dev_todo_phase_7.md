# Lessay Development Phase 7: Production Hardening - Testing

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

### 5. Update Package.json Scripts
- [x] **Add test command**
  ```json
  {
    "scripts": {
      "test": "jest"
    }
  }
  ```
  Verification: `npm test` runs Jest successfully

### 6. Update CI Workflow (`/.github/workflows/ci.yml`)
- [ ] **Add testing step**
  ```yaml
  jobs:
    build-and-test:
      steps:
        - run: npm test
  ```
  Verification: CI file includes `npm test` command