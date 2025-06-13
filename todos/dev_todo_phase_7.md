# Developer To-Do List: Phase 7 - Performance Optimization

**Objective:** Implement comprehensive performance improvements across the application stack.

## Tasks

### 1. Implement Redis Caching Layer
- [x] **Install Redis dependencies**
  - **Command:** `npm install redis @types/redis`
  - **Verification:** `package.json` includes `redis` in dependencies

- [x] **Create Redis client utility (`/lib/redis.ts`)**
  - **Code:**
    ```typescript
    import { createClient } from 'redis'
    import { config } from './config'

    const redisClient = createClient({
      url: config.redis.url
    })

    redisClient.on('error', (err) => console.error('Redis error:', err))

    export async function connectRedis() {
      if (!redisClient.isOpen) {
        await redisClient.connect()
      }
      return redisClient
    }

    export async function cacheGet(key: string) {
      const client = await connectRedis()
      return client.get(key)
    }

    export async function cacheSet(key: string, value: string, ttl?: number) {
      const client = await connectRedis()
      if (ttl) {
        return client.setEx(key, ttl, value)
      }
      return client.set(key, value)
    }
    ```
  - **Verification:** File exists with exported functions

### 2. Optimize Database Queries
- [ ] **Add indexes to Prisma schema (`/prisma/schema.prisma`)**
  - **Modifications:**
    ```prisma
    model Lesson {
      @@index([userId, difficulty])
    }
    model Progress {
      @@index([userId, completedAt])
    }
    ```
  - **Command:** `docker-compose up migration`
  - **Verification:** Check logs for "Running database migrations"

- [ ] **Implement query logging**
  - **Modify `/lib/prisma.ts`:**
    ```typescript
    const prisma = new PrismaClient({
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'query', emit: 'event' }
      ]
    })

    prisma.$on('query', (e) => {
      logger.debug({
        query: e.query,
        duration: e.duration,
        params: e.params
      }, 'Database query executed')
    })
    ```
  - **Verification:** Queries appear in logs with timing

### 3. Optimize API Endpoints
- [ ] **Cache lesson data in `/app/api/lessons/start/route.ts`**
  - **Modifications:**
    ```typescript
    const cacheKey = `lesson-start:${session.user.id}`
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return NextResponse.json(JSON.parse(cached))
    }
    // ... existing code ...
    await cacheSet(cacheKey, JSON.stringify(progress), 300) // 5 minute cache
    ```
  - **Verification:** Subsequent requests return cached data

- [ ] **Batch dashboard requests in `/components/DashboardView.tsx`**
  - **Modify useEffect:**
    ```typescript
    const response = await fetch('/api/stats/dashboard')
    const { fluency, srs } = await response.json()
    ```
  - **Create new endpoint `/app/api/stats/dashboard/route.ts`**
  - **Verification:** Single API call fetches all dashboard data

### 4. Implement Performance Monitoring
- [ ] **Add Prometheus metrics endpoint (`/app/api/metrics/route.ts`)**
  - **Install:** `npm install prom-client`
  - **Code:**
    ```typescript
    import { register, collectDefaultMetrics } from 'prom-client'

    collectDefaultMetrics()

    export async function GET() {
      const metrics = await register.metrics()
      return new Response(metrics, {
        headers: { 'Content-Type': register.contentType }
      })
    }
    ```
  - **Verification:** `/api/metrics` returns metrics data

### 5. Optimize Build Process
- [ ] **Implement module precompilation**
  - **Command:** `npm install @vercel/ncc`
  - **Add script to `package.json`:**
    ```json
    "scripts": {
      "bundle": "NCC_CONFIG_TS_CONFIG=tsconfig.bundle.json ncc build app/api/lessons/start/route.ts -o dist"
    }
    ```
  - **Verification:** `dist/` directory created with bundled code

### 6. Cleanup and Final Verification
- [ ] **Run performance benchmarks**
  - **Command:** `npm run test:performance`
  - **Verification:** Benchmark results show improved metrics

- [ ] **Update documentation (`/documentation/performance.md`)**
  - **Add:** Caching strategy, index details, monitoring setup
  - **Verification:** Documentation file exists with all sections

- [ ] **Clean up and reset for autonomous handoff**
  - **LLM Prompt:** "Update todos/master_development_plan.md to mark Phase 7 as complete"
  - **Verification:** Phase 7 marked [x] in master plan