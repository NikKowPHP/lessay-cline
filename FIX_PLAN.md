# FIX_PLAN.md

## 1. Update NextAuth Type Declarations
- [x] **Task 1: Add missing NextAuth type declarations**
  - **LLM Prompt:** "Add NextAuthOptions interface to typings/next-auth.d.ts"
  - **Verification:** TypeScript compiler no longer reports missing NextAuthOptions

## 2. Correct Import Path in SRS Route
- [ ] **Task 2: Fix authOptions import path**
  - **LLM Prompt:** "Update import path in app/api/stats/srs-overview/route.ts from '../../lib/auth' to '../../../lib/auth'"
  - **Verification:** File compiles without module resolution errors

## 3. Update Supabase Provider Configuration
- [ ] **Task 3: Modernize Supabase provider setup**
  - **LLM Prompt:** "Update lib/auth.ts to use @auth/supabase provider instead of next-auth/supabase-provider"
  - **Verification:** NextAuth initializes without provider-related errors

## 4. Clean Up and Reset
- [ ] **Task 4: Remove distress signal**
  - **LLM Prompt:** "Delete NEEDS_ASSISTANCE.md from root directory"
  - **Verification:** Distress file no longer exists