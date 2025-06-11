# Lessay Implementation Phase 1: Core Backend & User Auth

## Tasks for Developer AI

### 1. Create Supabase Server-Side Client Helper
**File:** `/lib/supabase-server.ts`  
**Action:** Create a server-side Supabase client for authenticated operations  
**Steps:**
- Import `createClient` and `createServerComponentClient` from `@supabase/ssr`
- Export a `supabaseServerClient` function that:
  - Accepts `cookies()` from `next/headers`
  - Returns a Supabase client configured with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Export a `getUserSession` helper that:
  - Uses the server client to call `auth.getUser()`
  - Returns the user object or null

**Verification:** File exists and exports both functions with proper TypeScript types

---

### 2. Implement Profile GET Route
**File:** `/app/api/users/profile/route.ts`  
**Action:** Add real user session handling  
**Steps:**
- Import `getUserSession` from `@/lib/supabase-server`
- Modify the GET function to:
  1. Call `getUserSession()`
  2. If no user, return `401 Unauthorized`
  3. Query Prisma for `User` with `user.id`
  4. Return profile data (excluding sensitive fields)

**Verification:** Route returns 401 when unauthenticated and profile data when logged in

---

### 3. Implement Profile PUT Route
**File:** `/app/api/users/profile/route.ts`  
**Action:** Add profile update functionality  
**Steps:**
- Keep existing auth check from GET route
- Add Prisma `user.update` call with:
  - `where: { id: user.id }`
  - `data` from request body (validate/sanitize first)
- Return updated profile data

**Verification:** PUT requests successfully update user data in database

---

### 4. Create Auth UI Component
**File:** `/components/Auth.tsx`  
**Action:** Build sign-up/sign-in interface  
**Steps:
- Create client-side Supabase client with `createClientComponentClient`
- Add:
  - Email input field
  - Password input field
  - Sign Up button (calls `supabase.auth.signUp`)
  - Sign In button (calls `supabase.auth.signInWithPassword`)
  - Error message display
- Style with Tailwind CSS

**Verification:** Component renders properly and allows user registration/login