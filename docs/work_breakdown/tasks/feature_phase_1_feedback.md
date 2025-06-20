# Feature Phase 1: User Feedback Implementation

## Tasks for Developer AI

### 1. Create Feedback API Endpoint
- **File:** `/app/api/feedback/report/route.ts`
- **Action:** Implement endpoint to handle feedback submissions
- **Content:**
```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { lessonId, userId, feedbackText, errorType } = await request.json();
  
  try {
    const feedback = await prisma.feedback.create({
      data: {
        lessonId,
        userId,
        feedbackText,
        errorType,
      }
    });
    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
```
- **Verification:** Endpoint exists and accepts POST requests

### 2. Update Prisma Schema
- **File:** `/prisma/schema.prisma`
- **Action:** Add Feedback model
- **Modification:**
```prisma
model Feedback {
  id           String   @id @default(uuid())
  lessonId     String
  lesson       Lesson   @relation(fields: [lessonId], references: [id])
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  feedbackText String
  errorType    String?
  createdAt    DateTime @default(now())
}
```
- **Verification:** Model exists in schema

### 3. Run Database Migration
- **Command:** `npx prisma migrate dev --name add_feedback_model`
- **Verification:** New migration file created in `prisma/migrations`

### 4. Add Feedback Button to Lesson UI
- **File:** `/components/LessonView.tsx`
- **Action:** Implement feedback reporting UI
- **Modification:**
```typescript
function ReportIssueButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const submitFeedback = async () => {
    await fetch('/api/feedback/report', {
      method: 'POST',
      body: JSON.stringify({
        lessonId: currentLesson.id,
        feedbackText: feedback,
        errorType: 'general'
      })
    });
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Report Issue</button>
      {isOpen && (
        <div className="feedback-modal">
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <button onClick={submitFeedback}>Submit</button>
        </div>
      )}
    </>
  );
}
```
- **Verification:** Button appears in lesson interface