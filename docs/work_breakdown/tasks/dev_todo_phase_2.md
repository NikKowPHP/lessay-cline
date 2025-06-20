# Lessay Development Phase 2: Learning Loop Implementation

## Tasks for Developer AI

### 1. Implement Lesson Start Route (`/app/api/lessons/start/route.ts`)
- [x] **Add authentication check**
  - Import `getUserSession` from `@/lib/supabase-server`
  - At start of POST function, add:
    ```typescript
    const session = await getUserSession()
    if (!session) return new Response('Unauthorized', { status: 401 })
    ```
  - Verification: Route returns 401 for unauthenticated requests

- [ ] **Implement lesson generation**
  - Call `AIService.generateLessonForUser(session.user.id)`
  - Store returned lesson data in Prisma:
    ```typescript
    const lesson = await prisma.lesson.create({
      data: {
        userId: session.user.id,
        content: generatedLesson.content
      }
    })
    ```
  - Verification: New lesson appears in database after API call

- [ ] **Create exercise record**
  - Add exercise creation after lesson creation:
    ```typescript
    const exercise = await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        prompt: generatedLesson.exercise.prompt,
        correctAnswer: generatedLesson.exercise.correctAnswer
      }
    })
    ```
  - Verification: Exercise linked to lesson in database

### 2. Implement Answer Submission Route (`/app/api/lessons/[id]/submit-answer/route.ts`)
- [ ] **Add authentication check**
  - Same pattern as lesson start route
  - Verification: Route rejects unauthenticated requests

- [ ] **Implement answer validation**
  - Find exercise by ID from URL params
  - Compare `textResponse` to `exercise.correctAnswer`
  - Verification: API correctly identifies matching answers

- [ ] **Create progress record**
  - Add progress tracking:
    ```typescript
    await prisma.userProgress.create({
      data: {
        userId: session.user.id,
        exerciseId: exercise.id,
        submittedAnswer: textResponse,
        isCorrect: answerMatches
      }
    })
    ```
  - Verification: Progress records appear in database

### 3. Update Lesson View Component (`/components/LessonView.tsx`)
- [ ] **Add answer input UI**
  - Create controlled text input component
  - Add state management for answer text
  - Verification: Input field appears and updates properly

- [ ] **Implement submission logic**
  - Add submit button handler that:
    - Calls `/api/lessons/${lessonId}/submit-answer`
    - Disables during submission
    - Handles errors
  - Verification: Button works and shows loading state

- [ ] **Add feedback display**
  - Create section showing:
    - Correct/incorrect indicator
    - Correct answer
    - Explanation (if available)
  - Style with Tailwind classes
  - Verification: Feedback appears after submission