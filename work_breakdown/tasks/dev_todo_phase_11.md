# Developer To-Do List: Phase 11 - Data Governance & Finalization

**Objective:** Implement data management policies and perform final project cleanup.

## Tasks

- [x] **1. Implement Audio Retention Policy**
  - Create Inngest cron job in `/app/inngest/functions.ts`:
    ```typescript
    inngest.createFunction(
      { id: 'audio-retention' },
      { cron: '0 0 * * *' }, // Daily at midnight
      async () => {
        // Query VoiceAnalysis records older than 30 days
        // Delete associated audio files from Supabase Storage
        // Delete database records
      }
    )
    ```
  - Verification: Function exists with correct schedule.

- [x] **2. Implement Account Deletion**
  - Create endpoint: `/app/api/users/delete-account/route.ts`
    - Require re-authentication
    - Delete all user-related data
    - Handle foreign key constraints
  - Verification: Endpoint securely deletes all user data.

- [x] **3. Add Environment Check**
  - Update `package.json`:
    ```json
    "scripts": {
      "check:env": "node scripts/check-env.js",
      "build": "npm run check:env && next build"
    }
    ```
  - Create `scripts/check-env.js` to validate all required variables.
  - Verification: Build fails if any variables are missing.

- [x] **4. Final Documentation Review**
  - Audit all JSDoc comments
  - Ensure API routes have proper documentation
  - Verify component prop types
  - Verification: All major components and functions documented.