# Hardening Phase 1: Observability Implementation

## Tasks for Developer AI

### 1. Install Logging Dependencies
**File Path:** Project root (`./`)
**Action:** Execute command to install pino and pino-pretty
**LLM Prompt:** "Execute the following shell command to install logging dependencies:"
**Command:** `npm install pino pino-pretty`
**Verification:** `pino` and `pino-pretty` appear in `package.json` dependencies

---

### 2. Create Logger Utility
**File Path:** `/lib/logger.ts`
**Action:** Create a centralized logger instance
**LLM Prompt:** "Create a new file at `/lib/logger.ts` with the following content:"
```typescript
import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
})

export default logger
```
**Verification:** File exists and exports a `logger` instance

---

### 3. Replace Console Logs in API Routes
**Action:** Update all API routes to use the new logger
**Files to Modify:**
- `app/api/lessons/[id]/submit-answer/route.ts`
- `app/api/lessons/start/route.ts`
- `app/api/payments/create-subscription/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/users/profile/route.ts`

**LLM Prompt:** "In each specified API route file, replace all `console.log` statements with appropriate logger methods (`logger.info`, `logger.error`, etc.)"
**Verification:** No `console.log` statements remain in API route files

---

### 4. Implement Health Check Endpoint
**File Path:** `/app/api/health/route.ts`
**Action:** Create a health check API route
**LLM Prompt:** "Create a new file at `/app/api/health/route.ts` with the following content:"
```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import logger from '@/lib/logger'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    logger.info('Health check successful')
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    logger.error('Health check failed', error)
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 503 }
    )
  }
}
```
**Verification:** File exists and returns 200 OK when database is accessible

---

### 5. Verify Logging Implementation
**Action:** Test the logging functionality
**LLM Prompt:** "Execute the following command to test the application and verify logs are being generated:"
**Command:** `npm run dev`
**Verification:** Application starts and logs appear in the console with proper formatting