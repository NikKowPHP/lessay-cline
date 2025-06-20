# Developer To-Do List: Phase 8 - Asynchronous Processing & Distributed Caching

**Objective:** Decouple long-running AI analysis tasks from request-response cycle and implement production-grade distributed caching.

## Tasks

- [ ] **1. Install Inngest**
  - Execute: `npm install inngest`
  - Initialize: `npx inngest-cli init`
  - Verification: `package.json` includes `"inngest"` in dependencies.

- [ ] **2. Create Inngest Function Handler**
  - Create file: `/app/inngest/route.ts`
    ```typescript
    import { serve } from 'inngest/next'
    import { functions } from './functions'

    export const { GET, POST, PUT } = serve({
      clientId: process.env.INNGEST_CLIENT_ID,
      functions,
    })
    ```
  - Create file: `/app/inngest/functions.ts`
    ```typescript
    import { inngest } from './client'
    import { analyzeSession } from '../lib/ai-service'

    export const functions = [
      inngest.createFunction(
        { id: 'post-session-analysis' },
        { event: 'ai/post-session-analysis' },
        async ({ event }) => {
          const { lessonId, audioUrl } = event.data
          return analyzeSession(lessonId, audioUrl)
        }
      )
    ]
    ```
  - Verification: Both files exist with correct content.

- [ ] **3. Refactor Submit Answer Endpoint**
  - Modify: `/app/api/lessons/[id]/submit-answer/route.ts`
    - Remove synchronous AI analysis call
    - Add Inngest send:
      ```typescript
      import { inngest } from '../../../lib/inngest'

      // After returning initial response
      await inngest.send({
        name: 'ai/post-session-analysis',
        data: { lessonId, audioUrl }
      })
      ```
  - Verification: Submit answer endpoint no longer contains direct AI analysis calls.

- [ ] **4. Implement Background Analysis Logic**
  - Move existing analysis logic from submit endpoint to:
    ```typescript
    // /lib/ai-service.ts
    export async function analyzeSession(lessonId: string, audioUrl: string) {
      // Existing analysis logic
      // Update SRS scores
      // Save VoiceAnalysis records
    }
    ```
  - Verification: All analysis logic resides in `analyzeSession` function.

- [ ] **5. Install Redis Client**
  - Execute: `npm install @upstash/redis`
  - Verification: `package.json` includes `"@upstash/redis"`.

- [ ] **6. Upgrade Cache Utility**
  - Modify: `/lib/cache.ts`
    - Replace `Map` with Redis client:
      ```typescript
      import { Redis } from '@upstash/redis'
      
      const redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })
      
      export const cache = {
        get: (key: string) => redis.get(key),
        set: (key: string, value: any, ttl: number) => 
          redis.setex(key, ttl, value)
      }
      ```
  - Verification: Cache utility uses Redis methods instead of in-memory Map.