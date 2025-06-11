# Hardening Phase 2: Error Handling Implementation

## Tasks for Developer AI

### 1. Prepare Error Handling Utilities
**File Path:** `/lib/errors.ts`
**Action:** Create error handling utilities
**LLM Prompt:** "Create a new file at `/lib/errors.ts` with the following content:"
```typescript
import { NextResponse } from 'next/server'
import logger from '@/lib/logger'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export function handleError(error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    logger.error({ error }, 'Database error occurred')
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: getPrismaErrorStatus(error) }
    )
  }

  logger.error({ error }, 'Unexpected error occurred')
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

function getPrismaErrorStatus(error: PrismaClientKnownRequestError): number {
  switch (error.code) {
    case 'P2002': return 409 // Unique constraint violation
    case 'P2025': return 404 // Record not found
    default: return 400 // Bad request
  }
}
```
**Verification:** File exists and exports `handleError` function

---

### 2. Update API Routes with Error Handling
**Action:** Modify all API routes to use structured error handling
**Files to Modify:**
- `app/api/lessons/[id]/submit-answer/route.ts`
- `app/api/lessons/start/route.ts`
- `app/api/payments/create-subscription/route.ts`
- `app/api/stats/fluency/route.ts`
- `app/api/stats/srs-overview/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/users/profile/route.ts`

**LLM Prompt:** "For each specified API route file:
1. Wrap the entire exported function body in a try/catch block
2. Use the handleError utility from '@/lib/errors' in catch blocks
3. Ensure all errors are properly logged
4. Maintain existing functionality"

**Example Modification:**
```typescript
// Before
export async function POST(request: Request) {
  const { tier } = await request.json()
  console.log('Creating subscription for tier:', tier)
  return NextResponse.json({ status: 'active' })
}

// After
import { handleError } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const { tier } = await request.json()
    logger.info('Creating subscription for tier:', { tier })
    return NextResponse.json({ status: 'active' })
  } catch (error) {
    return handleError(error)
  }
}
```
**Verification:** All API routes have try/catch blocks and use handleError

---

### 3. Add Health Check Error Handling
**File Path:** `/app/api/health/route.ts`
**Action:** Update health check to use new error handler
**LLM Prompt:** "Modify `/app/api/health/route.ts` to use the handleError utility:"
```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import logger from '@/lib/logger'
import { handleError } from '@/lib/errors'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    logger.info('Health check successful')
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}
```
**Verification:** Health check uses handleError and maintains functionality

---

### 4. Verify Error Handling
**Action:** Test error scenarios
**LLM Prompt:** "Execute the following command to test the application and verify error handling:"
**Command:** `npm run dev`
**Verification:**
1. Trigger intentional errors in API routes
2. Confirm proper error responses (status codes and JSON format)
3. Check that errors appear in logs with appropriate levels