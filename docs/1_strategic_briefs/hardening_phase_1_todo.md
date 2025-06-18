# Hardening Phase 1: Security & Reliability

## Tasks for Developer AI

### 1. Implement Rate Limiting
- **File:** `/middleware/rate-limiter.ts`
- **Action:** Add Redis-based rate limiting
- **Steps:**
  1. Install `@upstash/ratelimit`
  2. Create Redis client config
  3. Apply to API routes
- **Verification:** 429 responses after 10 requests

### 2. Add Input Validation
- **File:** `/lib/validators/*`
- **Action:** Create Zod schemas
- **Steps:
  1. Add `zod` dependency
  2. Create schemas for all API inputs
  3. Integrate with routes
- **Verification:** Invalid inputs rejected

### 3. Setup Error Tracking
- **File:** `/lib/sentry.ts`
- **Action:** Configure Sentry
- **Steps:
  1. Add `@sentry/nextjs`
  2. Initialize in `_app.tsx`
  3. Add error boundaries
- **Verification:** Errors appear in Sentry