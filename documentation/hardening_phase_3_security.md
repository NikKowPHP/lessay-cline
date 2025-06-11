# Hardening Phase 3: Security Implementation

## Tasks for Developer AI

### 1. Install Zod for Validation
**File Path:** Project root (`./`)
**Action:** Execute command to install Zod
**LLM Prompt:** "Execute the following shell command to install Zod:"
**Command:** `npm install zod`
**Verification:** `zod` appears in `package.json` dependencies

---

### 2. Create Validation Schemas
**File Path:** `/lib/validators.ts`
**Action:** Create shared validation schemas
**LLM Prompt:** "Create a new file at `/lib/validators.ts` with the following content:"
```typescript
import { z } from 'zod'

export const lessonStartSchema = z.object({
  userId: z.string().uuid(),
  targetLanguage: z.string().length(2)
})

export const answerSubmitSchema = z.object({
  exerciseId: z.string().uuid(),
  textResponse: z.string().min(1),
  audioBlobUrl: z.string().url().optional()
})

export const subscriptionSchema = z.object({
  tier: z.enum(['free', 'premium', 'pro']),
  paymentMethodId: z.string()
})
```
**Verification:** File exists and exports validation schemas

---

### 3. Implement Route Validation
**Action:** Add validation to API routes with request bodies
**Files to Modify:**
- `app/api/lessons/[id]/submit-answer/route.ts`
- `app/api/lessons/start/route.ts`
- `app/api/payments/create-subscription/route.ts`
- `app/api/users/profile/route.ts`

**LLM Prompt:** "For each specified API route:
1. Import appropriate validator from '@/lib/validators'
2. Validate request body at start of handler
3. Return 400 with validation errors if invalid
4. Maintain existing functionality"

**Example Modification:**
```typescript
import { NextResponse } from 'next/server'
import { answerSubmitSchema } from '@/lib/validators'
import { handleError } from '@/lib/errors'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validation = answerSubmitSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    // Existing handler logic...
  } catch (error) {
    return handleError(error)
  }
}
```
**Verification:** Routes return 400 for invalid requests with error details

---

### 4. Install Rate Limiting Package
**File Path:** Project root (`./`)
**Action:** Execute command to install rate limiter
**LLM Prompt:** "Execute the following shell command to install rate limiting:"
**Command:** `npm install @upstash/ratelimit`
**Verification:** `@upstash/ratelimit` appears in `package.json` dependencies

---

### 5. Configure Rate Limiting
**File Path:** `/lib/rateLimit.ts`
**Action:** Create rate limiting configuration
**LLM Prompt:** "Create a new file at `/lib/rateLimit.ts` with the following content:"
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true
})
```
**Verification:** File exists and exports rate limiter instance

---

### 6. Apply Rate Limiting to Sensitive Endpoints
**Action:** Add rate limiting to high-risk routes
**Files to Modify:**
- `app/api/lessons/start/route.ts`
- `app/api/users/profile/route.ts`

**LLM Prompt:** "For each specified API route:
1. Import rate limiter from '@/lib/rateLimit'
2. Get client IP from headers (request.headers.get('x-forwarded-for'))
3. Check rate limit at start of handler
4. Return 429 if limit exceeded
5. Maintain existing functionality"

**Example Modification:**
```typescript
import { ratelimit } from '@/lib/rateLimit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // Existing handler logic...
}
```
**Verification:** Routes return 429 after exceeding request limits

---

### 7. Verify Security Features
**Action:** Test validation and rate limiting
**LLM Prompt:** "Execute the following command to test the security features:"
**Command:** `npm run dev`
**Verification:**
1. Invalid requests return 400 with error details
2. Excessive requests to limited endpoints return 429
3. Valid requests function normally