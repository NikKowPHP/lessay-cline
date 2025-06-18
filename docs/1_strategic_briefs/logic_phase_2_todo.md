# Logic Phase 2: Lesson System Implementation

## Tasks for Developer AI

### 1. Implement Lesson Start Route
- **File:** `/app/api/lessons/start/route.ts`
- **Action:** Add authenticated lesson generation
- **Steps:**
  1. Import `getUserSession` from `@/lib/supabase/server`
  2. Add session check to POST function
  3. Call `AIService.generateLessonForUser()`
  4. Store lesson in Prisma
- **Verification:** New lessons appear in database

### 2. Create Answer Submission Route
- **File:** `/app/api/lessons/[id]/submit-answer/route.ts`
- **Action:** Add answer validation
- **Steps:**
  1. Add authentication check
  2. Compare answer to correct value
  3. Create progress record
- **Verification:** Correct/incorrect feedback works

### 3. Update Lesson View Component
- **File:** `/components/LessonView.tsx`
- **Action:** Add answer input UI
- **Steps:**
  1. Create text input state
  2. Add submit button handler
  3. Display feedback
- **Verification:** Full lesson flow works