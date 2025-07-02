# Implementation Plan: Codebase & Documentation Alignment

This plan addresses all findings from the audit report. It is structured to first resolve critical architectural conflicts, then implement missing functionality, and finally align the documentation. The primary directive is to **standardize the entire application on Supabase for authentication**.

---

### **P0 - Critical Code Fixes: Standardize on Supabase Authentication**

These tasks will remove the NextAuth.js implementation and refactor the application to use Supabase Auth exclusively.

- [x] **REFACTOR**: Replace NextAuth middleware with a Supabase-native implementation.
    - **File**: `middleware.ts`
    - **Action**: Delete the current content of the file. Replace it with a new implementation that uses `createMiddlewareClient` from `@supabase/auth-helpers-nextjs` to protect routes. The logic should check for a valid Supabase session and redirect to a login page if one doesn't exist for protected paths.
    - **Reason**: Audit finding: Critical architectural conflict with two authentication systems. The root `middleware.ts` currently uses NextAuth.

- [x] **REFACTOR**: Update root layout to use Supabase session for redirects.
    - **File**: `app/layout.tsx`
    - **Action**: Remove the `getServerSession` call from `next-auth`. Instead, use the `supabaseServerClient` from `lib/supabase/server.ts` to check for a user session. The redirect logic for new users should be based on the Supabase user object and the `status` field in the Prisma database.
    - **Reason**: Audit finding: The layout's core session logic is tied to the deprecated NextAuth system.

- [x] **REFACTOR**: Convert user profile API to use Supabase Auth.
    - **File**: `app/api/users/profile/route.ts`
    - **Action**: Remove all `getServerSession` and `authOptions` imports from NextAuth. In both the `GET` and `PUT` functions, retrieve the user by calling `const { data: { user } } = await supabase.auth.getUser()` using a server-side Supabase client. Use the `user.id` from the result for database operations.
    - **Reason**: Audit finding: This critical API endpoint for user data uses the deprecated NextAuth system.

- [x] **REFACTOR**: Convert settings API to use Supabase Auth.
    - **File**: `app/api/settings/route.ts`
    - **Action**: Remove `getServerSession` and `authOptions` imports. In the `POST` function, get the user ID from a server-side Supabase client (`supabase.auth.getUser()`).
    - **Reason**: Audit finding: This security-sensitive endpoint uses the deprecated NextAuth system.

- [x] **REFACTOR**: Convert onboarding API to use Supabase Auth.
    - **File**: `app/api/onboarding/create-profile/route.ts`
    - **Action**: Remove the custom `getServerSession` import. Use a server-side Supabase client to get the authenticated user's ID (`supabase.auth.getUser()`) before updating the user profile in Prisma.
    - **Reason**: The onboarding flow is a critical part of the user journey and must use the standardized auth system.

- [x] **REFACTOR**: Convert all AI-related API endpoints to use Supabase Auth.
    - **File**: `app/api/ai/analyze/route.ts`, `app/api/ai/generate-lesson/route.ts`, `app/api/ai/stats/route.ts`
    - **Action**: In each file, remove the `getServerSession` and `authOptions` imports. Replace the authentication check with a call to a server-side Supabase client to get the user ID.
    - **Reason**: To ensure all backend endpoints uniformly use Supabase for authentication.

- [x] **REFACTOR**: Convert all stats-related API endpoints to use Supabase Auth.
    - **File**: `app/api/stats/export/route.ts`, `app/api/stats/progress/route.ts`
    - **Action**: In each file, remove the `getServerSession` and `authOptions` imports. Replace the authentication check with a call to a server-side Supabase client to get the user ID.
    - **Reason**: To ensure all backend endpoints uniformly use Supabase for authentication.

- [x] **REMOVE**: Delete the NextAuth.js configuration file.
    - **File**: `lib/auth-options.ts`
    - **Action**: Delete this file from the repository.
    - **Reason**: Audit finding: This file is the core configuration for the deprecated NextAuth.js system and must be removed.

- [x] **REMOVE**: Delete the unused Supabase auth middleware file.
    - **File**: `lib/auth-middleware.ts`
    - **Action**: Delete this file from the repository.
    - **Reason**: Audit finding: This file is redundant and confusing now that the root `middleware.ts` will be refactored for Supabase.

---

### **P1 - Implementation of Missing Features & Stubs**

- [x] **UPDATE**: Implement real data fetching for the fluency stats API.
    - **File**: `app/api/stats/fluency/route.ts`
    - **Action**: Modify the `GET` handler to query the `VoiceAnalysis` or `LessonAttempt` table in the database for the authenticated user. Calculate and return real fluency metrics like speaking pace. Use Supabase for auth.
    - **Reason**: Audit finding: The endpoint returns hardcoded mock data.

- [x] **UPDATE**: Implement real data fetching for the SRS overview API.
    - **File**: `app/api/stats/srs-overview/route.ts`
    - **Action**: Modify the `GET` handler to query the `SRSEntry` table for the authenticated user. Calculate and return real statistics, such as `totalItems`, `dueForReview`, and the strength distribution. Use Supabase for auth.
    - **Reason**: Audit finding: The endpoint returns hardcoded mock data.

- [x] **CREATE**: Implement the missing endpoint to get user subscription details.
    - **File**: `app/api/payments/subscription/route.ts`
    - **Action**: Create a new `route.ts` file at this path. The `GET` handler should retrieve the user's `subscriptionId` and `stripeCustomerId` from the database and use the Stripe API to fetch the subscription status, current period end, and plan details.
    - **Reason**: Audit finding: A documented, critical payment-related API endpoint is missing.

---

### **P2 - Correcting Mismatches**

- [x] **CREATE**: Implement the API for setting language preference as specified.
    - **File**: `app/api/users/language-preference/route.ts`
    - **Action**: Create a new `route.ts` file. The `POST` handler should accept `{ "targetLanguage": "de", "nativeLanguage": "en" }` in the request body. It should update these specific fields for the authenticated user in the database.
    - **Reason**: Audit finding: The API implementation for this feature did not match the specification. This creates the specified endpoint for 1:1 compliance.

---

### **P3 - Documentation Updates**

- [x] **REMOVE**: Delete the obsolete `FIX_PLAN.md` file.
    - **File**: `FIX_PLAN.md`
    - **Action**: Delete this file from the repository.
    - **Reason**: The plan was for an infrastructure setup that is out of scope and its auth-related comments are being superseded by this plan.

- [x] **DOCS**: Document all missing environment variables.
    - **File**: `docs/human_todo.md` and `docs/templates/deployment_playbook_template.md`
    - **Action**: Add entries for `REDIS_URL`, `LOG_LEVEL`, and `AWS_REGION` to both the user setup checklist and the deployment playbook, explaining what each is used for.
    - **Reason**: Audit finding: Critical configuration variables are used in the code but not documented.

- [x] **DOCS**: Update the API specification with undocumented endpoints.
    - **File**: `docs/templates/api_spec_template.md`
    - **Action**: Add sections for the `POST /api/settings`, `POST /api/users/sync`, and `GET /api/payments/subscription` endpoints, detailing their purpose, request/response bodies, and authentication requirements.
    - **Reason**: Audit finding: Several existing API endpoints are not documented.

- [x] **DOCS**: Update the technical design to include undocumented features.
    - **File**: `docs/templates/technical_design_template.md`
    - **Action**: Add new sections describing the purpose and implementation of: 1. The Audit Logging system (`AuditLog` model and `logSecurityEvent` function). 2. The Supabase-to-Prisma user sync mechanism (`/api/users/sync`). 3. The new Supabase-based `middleware.ts` for route protection.
    - **Reason**: Audit finding: Major features and architectural components exist in the code but are not reflected in the design documents.

- [x] **DOCS**: Purge all references to NextAuth.js from the documentation.
    - **File**: Entire `./docs/` directory.
    - **Action**: Perform a repository-wide search within the `docs` directory for "NextAuth", "getServerSession", and "authOptions". Remove or replace these references with the corresponding Supabase Auth concepts.
    - **Reason**: To bring the entire documentation suite in line with the "Supabase only" authentication strategy.