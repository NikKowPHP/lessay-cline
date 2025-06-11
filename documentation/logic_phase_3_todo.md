# Lessay Implementation Phase 3: AI Service Integration

## Tasks for Developer AI

### 1. Install Google AI SDK
**Command:**  
```bash
npm install @google/generative-ai
```
**Verification:** Package appears in `package.json` dependencies

---

### 2. Initialize AI Client
**File:** `/lib/ai-service.ts`  
**Action:** Configure real Google AI client  
**Steps:**
- Import `GoogleGenerativeAI` from SDK
- Create client instance using `AI_API_KEY` from env
- Export initialized client
- Remove any existing stub implementations

**Verification:** File exports properly configured client instance

---

### 3. Implement Lesson Generation
**File:** `/lib/ai-service.ts`  
**Action:** Replace stubbed `generateLessonForUser`  
**Steps:**
1. Construct detailed prompt per `technical_design_template.md`
2. Call Gemini model with:
   - `temperature: 0.7`
   - `maxOutputTokens: 2048`
3. Parse JSON response into:
   - `lessonContent`
   - `exercises[]` with:
     - `question`
     - `correctAnswer`
     - `explanation`
4. Return structured lesson data

**Verification:** Function returns valid lesson structure from API call

---

### 4. Add Audio Analysis Placeholder
**File:** `/lib/ai-service.ts`  
**Action:** Connect audio analysis to Prisma  
**Steps:**
- Keep function signature but:
  1. Log "Real audio analysis will be implemented here"
  2. Create `VoiceAnalysis` record in Prisma with dummy metrics:
     - `fluencyScore: 0.8`
     - `pronunciationScore: 0.75`
     - `accuracyScore: 0.85`
  3. Return dummy metrics object

**Verification:** Function creates database records and returns expected structure