# INTERVENTION FIX PLAN (ATOMIC)

**Problem:** The Developer AI failed to create the error handling middleware file (`/lib/errorHandler.ts`).

- [x] **Task 1: Create the error handling middleware file**
    - **(File):** `/lib/errorHandler.ts`
    - **(LLM Prompt):** "Create a new file at `/lib/errorHandler.ts` with the following content:"
    ```typescript
    import { NextResponse } from 'next/server'

    export function errorHandler(err: Error, req: NextRequest) {
      const statusCode = 500;
      const errorId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.error({ errorId, err }, 'Request failed');
      return NextResponse.json(
        { 
          error: err.message,
          errorId,
          statusCode 
        },
        { status: statusCode }
      );
    }
    ```
    - **(Verification):** "The file `/lib/errorHandler.ts` exists and contains the specified content."

- [ ] **Task 2: Clean up and reset for autonomous handoff**
    - **LLM Prompt:** "Delete the file `NEEDS_ASSISTANCE.md` from the root directory."
    - **Verification:** The file `NEEDS_ASSISTANCE.md` no longer exists.