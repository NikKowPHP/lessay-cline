# Phase 16: Voice Analysis Diagnostics Implementation

## Tasks

### 1. Database Schema Update
- [ ] **Add VoiceAnalysis model**
  - Add to `prisma/schema.prisma`:
    ```prisma
    model VoiceAnalysis {
      id         String   @id @default(cuid())
      userId     String
      lessonId   String?
      wpm        Int
      accuracy   Float
      hesitation Int
      timestamp  DateTime @default(now())
      user       User     @relation(fields: [userId], references: [id])
      lesson     Lesson?  @relation(fields: [lessonId], references: [id])
    }
    ```
- [ ] **Create migration file**
  - Run `npx prisma migrate dev --name add_voice_analysis_model`

### 2. Analysis Logic
- [ ] **Implement diagnostic metrics calculation**
  - Create `/lib/voice-analysis.ts` with functions:
    - `calculateWpm()`
    - `calculateAccuracy()`
    - `detectHesitations()`

### 3. API Integration
- [ ] **Create analysis endpoint**
  - `/app/api/analysis/voice/route.ts`
  - Accepts audio files, returns analysis metrics

### 4. Storage Integration
- [ ] **Implement audio storage**
  - Store audio files in Supabase Storage
  - Link to VoiceAnalysis records

### 5. Frontend Display
- [ ] **Add analysis results to LessonView**
  - Show metrics after each exercise
  - Provide detailed feedback

### 6. Testing
- [ ] **Write comprehensive tests**
  - `/tests/voice-analysis.test.ts`