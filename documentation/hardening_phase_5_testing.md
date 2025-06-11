# Hardening Phase 5: Testing Implementation

## Tasks for Developer AI

### 1. Install Testing Dependencies
**File Path:** Project root (`./`)
**Action:** Execute command to install Jest and related packages
**LLM Prompt:** "Execute the following shell command to install testing dependencies:"
**Command:** `npm install jest ts-jest @types/jest --save-dev`
**Verification:** Packages appear in `package.json` devDependencies

---

### 2. Configure Jest for TypeScript
**File Path:** `jest.config.ts`
**Action:** Create Jest configuration file
**LLM Prompt:** "Create a new file at `jest.config.ts` with the following content:"
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
**Verification:** Configuration file exists with correct settings

---

### 3. Create Auth Test File
**File Path:** `/tests/auth.test.ts`
**Action:** Implement authentication tests
**LLM Prompt:** "Create a new file at `/tests/auth.test.ts` with the following content:"
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
**Verification:** File exists with all test cases

---

### 4. Create Lesson Test File
**File Path:** `/tests/lessons.test.ts`
**Action:** Implement lesson flow tests
**LLM Prompt:** "Create a new file at `/tests/lessons.test.ts` with the following content:"
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
**Verification:** File exists with all test cases

---

### 5. Update CI Workflow
**File Path:** `/.github/workflows/ci.yml`
**Action:** Add test step to CI pipeline
**LLM Prompt:** "Modify the CI workflow to include testing:"
```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test
```
**Verification:** CI file includes `npm test` command

---

### 6. Verify Test Suite
**Action:** Run the test suite
**LLM Prompt:** "Execute the following command to run tests:"
**Command:** `npm test`
**Verification:** All tests pass successfully