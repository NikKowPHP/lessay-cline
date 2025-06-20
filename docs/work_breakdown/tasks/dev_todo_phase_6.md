# Lessay Development Phase 6: Production Hardening - Security & Performance

## Tasks for Developer AI

### 1. Install Security Dependencies
- [ ] **Add Zod and Rate Limiter**
  ```bash
  npm install zod @upstash/ratelimit
  ```
  Verification: Packages appear in `package.json` dependencies

### 2. Create Validation Schemas (`/lib/validators.ts`)
- [ ] **Implement input validators**
  ```typescript
  import { z } from 'zod';

  export const lessonStartSchema = z.object({
    userId: z.string().uuid(),
    targetLanguage: z.string().length(2)
  });

  export const answerSubmitSchema = z.object({
    exerciseId: z.string().uuid(),
    textResponse: z.string().min(1),
    audioBlobUrl: z.string().url().optional()
  });
  ```
  Verification: File exists with exported schemas

### 3. Validate API Routes
- [ ] **Add validation to routes**
  Files to modify:
  - `app/api/lessons/[id]/submit-answer/route.ts`
  - `app/api/lessons/start/route.ts`
  - `app/api/payments/create-subscription/route.ts`
  - `app/api/users/profile/route.ts`

  Example implementation:
  ```typescript
  const body = await request.json();
  const validation = answerSubmitSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error.flatten() },
      { status: 400 }
    );
  }
  ```
  Verification: Routes return 400 for invalid requests

### 4. Configure Rate Limiting (`/lib/rateLimit.ts`)
- [ ] **Set up rate limiter**
  ```typescript
  import { Ratelimit } from '@upstash/ratelimit';
  import { Redis } from '@upstash/redis';

  export const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true
  });
  ```
  Verification: File exports rate limiter instance

### 5. Apply Rate Limits to Sensitive Endpoints
- [ ] **Protect high-traffic routes**
  Files to modify:
  - `app/api/lessons/start/route.ts`
  - `app/api/users/profile/route.ts`

  Example implementation:
  ```typescript
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  ```
  Verification: Routes return 429 after 10 requests/minute

### 6. Optimize Database Performance
- [ ] **Add index to UserProgress model**
  Modify `prisma/schema.prisma`:
  ```prisma
  model UserProgress {
    // ... existing fields
    @@index([userId, metric], name: "UserProgress_userId_metric_index")
  }
  ```
  Verification: Index definition exists in schema

- [ ] **Create and apply migration**
  ```bash
  npx prisma migrate dev --name add_performance_indexes
  ```
  Verification: New migration file created

### 7. Implement Caching (`/lib/cache.ts`)
- [ ] **Create cache utility**
  ```typescript
  const cache = new Map<string, { data: any, expires: number }>();

  export function getFromCache<T>(key: string): T | null {
    const item = cache.get(key);
    return item?.expires > Date.now() ? item.data : null;
  }

  export function setToCache(key: string, data: any, ttl = 300000) {
    cache.set(key, { data, expires: Date.now() + ttl });
  }
  ```
  Verification: File exports cache functions

### 8. Cache Stats Endpoints
- [ ] **Add caching to dashboard routes**
  Files to modify:
  - `app/api/stats/fluency/route.ts`
  - `app/api/stats/srs-overview/route.ts`

  Example implementation:
  ```typescript
  const cacheKey = `stats-${userId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  const data = await fetchData();
  setToCache(cacheKey, data);
  return NextResponse.json(data);
  ```
  Verification: Repeated requests return cached data