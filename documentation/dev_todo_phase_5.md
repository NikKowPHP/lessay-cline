# Lessay Development Phase 5: Production Hardening - Observability & Error Handling

## Tasks for Developer AI

### 1. Install Logging Packages
- [ ] **Add pino and pino-pretty**
  ```bash
  npm install pino pino-pretty
  ```
  Verification: Packages appear in `package.json` dependencies

### 2. Create Logger Utility (`/lib/logger.ts`)
- [ ] **Implement centralized logger**
  ```typescript
  import pino from 'pino';

  const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      }
    }
  });

  export default logger;
  ```
  Verification: File exists and exports logger instance

### 3. Replace Console Logs in API Routes
- [ ] **Update all API routes to use logger**
  Files to modify:
  - `app/api/lessons/[id]/submit-answer/route.ts`
  - `app/api/lessons/start/route.ts`
  - `app/api/payments/create-subscription/route.ts`
  - `app/api/stats/fluency/route.ts`
  - `app/api/stats/srs-overview/route.ts`
  - `app/api/stripe/webhook/route.ts`
  - `app/api/users/profile/route.ts`

  Verification: No `console.log` statements remain in API routes

### 4. Implement Error Handling Utility (`/lib/errors.ts`)
- [ ] **Create error handler**
  ```typescript
  import { NextResponse } from 'next/server';
  import logger from '@/lib/logger';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

  export function handleError(error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error({ error }, 'Database error occurred');
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: getPrismaErrorStatus(error) }
      );
    }

    logger.error({ error }, 'Unexpected error occurred');
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }

  function getPrismaErrorStatus(error: PrismaClientKnownRequestError): number {
    switch (error.code) {
      case 'P2002': return 409; // Unique constraint
      case 'P2025': return 404; // Not found
      default: return 400; // Bad request
    }
  }
  ```
  Verification: File exists and handles Prisma/unknown errors

### 5. Add Health Check Endpoint (`/app/api/health/route.ts`)
- [ ] **Implement health check**
  ```typescript
  import { NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import logger from '@/lib/logger';
  import { handleError } from '@/lib/errors';

  export async function GET() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Health check successful');
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }
  ```
  Verification: Endpoint returns 200 when database is accessible

### 6. Wrap API Routes in Try/Catch
- [ ] **Update all API routes with error handling**
  Example modification:
  ```typescript
  import { handleError } from '@/lib/errors';

  export async function POST(request: Request) {
    try {
      // Route logic here
    } catch (error) {
      return handleError(error);
    }
  }
  ```
  Verification: All API routes have proper error handling