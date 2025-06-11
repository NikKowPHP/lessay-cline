# Hardening Phase 4: Performance Optimization

## Tasks for Developer AI

### 1. Add Database Indexes
**File Path:** `/prisma/schema.prisma`
**Action:** Add compound index to UserProgress model
**LLM Prompt:** "Modify the UserProgress model in `/prisma/schema.prisma` to add a compound index:"
```prisma
model UserProgress {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  metric      String
  score       Float
  lastUpdated DateTime @default(now())

  @@index([userId, metric], name: "UserProgress_userId_metric_index")
}
```
**Verification:** Index definition exists in schema.prisma

---

### 2. Apply Database Migration
**File Path:** Project root (`./`)
**Action:** Create and apply migration
**LLM Prompt:** "Execute the following command to create and apply the migration:"
**Command:** `npx prisma migrate dev --name add_performance_indexes`
**Verification:** New migration file exists in prisma/migrations directory

---

### 3. Implement Basic Caching
**File Path:** `/lib/cache.ts`
**Action:** Create caching utility
**LLM Prompt:** "Create a new file at `/lib/cache.ts` with the following content:"
```typescript
const cache = new Map<string, { data: any, expires: number }>()

export function getFromCache<T>(key: string): T | null {
  const item = cache.get(key)
  if (!item || item.expires < Date.now()) {
    return null
  }
  return item.data as T
}

export function setToCache(key: string, data: any, ttl: number = 300000) {
  cache.set(key, {
    data,
    expires: Date.now() + ttl
  })
}

export function clearCache(key: string) {
  cache.delete(key)
}
```
**Verification:** File exists and exports cache functions

---

### 4. Add Caching to Stats Endpoints
**Action:** Implement caching in dashboard routes
**Files to Modify:**
- `app/api/stats/fluency/route.ts`
- `app/api/stats/srs-overview/route.ts`

**LLM Prompt:** "For each specified stats route:
1. Import cache functions from '@/lib/cache'
2. Generate cache key based on user ID and route
3. Check cache before querying database
4. Store results in cache after querying
5. Maintain existing functionality"

**Example Modification:**
```typescript
import { getFromCache, setToCache } from '@/lib/cache'

export async function GET(request: Request) {
  const cacheKey = `stats-fluency-${userId}`
  const cached = getFromCache(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  const data = await fetchDataFromDB() // Existing logic
  
  setToCache(cacheKey, data)
  return NextResponse.json(data)
}
```
**Verification:** Repeated requests within 5 minutes return cached data

---

### 5. Verify Performance Improvements
**Action:** Test database and caching changes
**LLM Prompt:** "Execute the following command to test performance features:"
**Command:** `npm run dev`
**Verification:**
1. Database queries for stats are faster with indexes
2. Repeated stat requests return cached data
3. Data updates reflect after cache expires