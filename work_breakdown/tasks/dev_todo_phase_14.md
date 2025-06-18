# Phase 14: Spaced Repetition System Implementation

## Tasks

### 1. Database Schema Update
- [x] **Add SRSEntry model to Prisma schema**
  - Add model in `prisma/schema.prisma`:
    ```prisma
    model SRSEntry {
      id        String   @id @default(cuid())
      userId    String
      itemId    String   // ID of vocabulary/grammar item
      nextReview DateTime
      interval  Int
      ease      Float
      user      User     @relation(fields: [userId], references: [id])
    }
    ```
- [x] **Create migration file**
  - Run `npx prisma migrate dev --name add_srs_model`

### 2. SRS Core Logic
- [x] **Implement SRS scheduling algorithm**
  - Create `/lib/srs.ts` with functions:
    - `scheduleNextReview()`
    - `getDueItems()`
    - `updateSrsEntry()`

### 3. API Integration
- [x] **Create SRS endpoints**
  - `/app/api/srs/due-items/route.ts`
  - `/app/api/srs/record-review/route.ts`

### 4. Frontend Integration
- [ ] **Add SRS review component**
  - Create `/components/SRSReview.tsx`

### 5. Testing
- [ ] **Write comprehensive tests**
  - `/tests/srs.test.ts`