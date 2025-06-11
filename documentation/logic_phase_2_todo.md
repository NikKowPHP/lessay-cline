# Lessay Implementation Phase 2: Learning Loop Logic

## Tasks for Developer AI

### 1. Implement Lesson Start Route
**File:** `/app/api/lessons/start/route.ts`  
**Action:** Add real lesson generation logic  
**Steps:**
- Import `getUserSession` from `@/lib/supabase-server`
- Modify POST function to:
  1. Authenticate user (return 401 if not logged in)
  2. Call `AIService.generateLessonForUser` with user's ID
  3. Create Prisma records for:
     - `Lesson` (with generated content)
     - `Exercise` (linked to lesson)
  4. Return lesson ID and first exercise

**Verification:** Route creates database entries and returns structured lesson data

---

### 2. Implement Answer Submission Route
**File:** `/app/api/lessons/[id]/submit-answer/route.ts`  
**Action:** Add answer processing logic  
**Steps:**
- Import `getUserSession` for auth
- Modify POST function to:
  1. Authenticate user
  2. Find exercise by ID
  3. Compare `textResponse` to `correctAnswer`
  4. Create `UserProgress` record with:
     - `isCorrect` flag
     - `submittedAnswer`
     - `exerciseId`
     - `userId`
  5. Return feedback object with:
     - `isCorrect`
     - `correctAnswer`
     - `explanation`

**Verification:** Submissions create progress records and return proper feedback

---

### 3. Update Lesson View Component
**File:** `/components/LessonView.tsx`  
**Action:** Add interactive exercise UI  
**Steps:**
- Add:
  - Text input field for answers
  - Submit button that:
    - Calls submit-answer API
    - Disables during submission
  - Feedback display area showing:
    - Correct/incorrect indicator
    - Explanation (if available)
- Handle loading states
- Style with Tailwind CSS

**Verification:** Component allows answer submission and displays feedback