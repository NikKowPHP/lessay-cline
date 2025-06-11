# Development Phase 1: Core Backend & User Authentication

## Tasks for Developer AI

### 1. Implement User Authentication
- **File:** `/lib/supabase/server.ts`
- **Action:** Create server-side Supabase client utilities
- **Steps:**
  1. Create directory `lib/supabase`
  2. Create file `server.ts` with:
     - `supabaseServerClient` function using `createServerComponentClient`
     - `getUserSession` helper to fetch user session
- **Verification:** File exports both functions with proper TypeScript types

### 2. Create Profile GET Route
- **File:** `/app/api/users/profile/route.ts`
- **Action:** Add authenticated profile retrieval
- **Steps:**
  1. Import `getUserSession` from `@/lib/supabase/server`
  2. Add session check to GET function
  3. Query Prisma for user data
- **Verification:** Returns 401 when unauthenticated, profile data when valid

### 3. Implement Profile PUT Route
- **File:** `/app/api/users/profile/route.ts`
- **Action:** Add profile update functionality
- **Steps:**
  1. Reuse auth check from GET route
  2. Add Prisma `user.update` call
  3. Return updated profile
- **Verification:** PUT requests update user data successfully

### 4. Create Auth UI Component
- **File:** `/components/Auth.tsx`
- **Action:** Build sign-up/sign-in interface
- **Steps:**
  1. Create client-side Supabase client
  2. Add email/password fields
  3. Implement sign-up/sign-in buttons
- **Verification:** Component renders and allows user registration/login

### 5. Implement User Sync Endpoint
- **File:** `/api/users/sync/route.ts`
- **Action:** Create public profile after auth sign-up
- **Steps:**
  1. Create new route file
  2. Listen for Supabase auth events
  3. Create corresponding Prisma user record
- **Verification:** New auth users get public profiles automatically

## Phase Completion Verification
1. All 5 task verifications pass
2. User can:
   - Register/login via UI
   - Access protected profile route
   - Update profile information
   - Have profile auto-created on sign-up