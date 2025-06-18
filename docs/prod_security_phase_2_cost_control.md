# Production Security Phase 2: AI Cost Control Implementation

## Tasks for Developer AI

### 1. Update User Model
- **File:** `/prisma/schema.prisma`
- **Action:** Add tier field to User model
- **Modification:**
```prisma
model User {
  id           String   @id @default(uuid())
  // ... existing fields
  tier         String   @default('free')
}
```
- **Verification:** Field exists in User model

### 2. Create Usage Tracking Model
- **File:** `/prisma/schema.prisma`
- **Action:** Add UserUsage model
- **Modification:**
```prisma
model UserUsage {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  count       Int      @default(1)
  date        DateTime @default(now())
  @@index([userId, date])
}
```
- **Verification:** Model exists in schema

### 3. Run Database Migration
- **Command:** `npx prisma migrate dev --name add_usage_tracking`
- **Verification:** New migration file created

### 4. Implement Usage Check in Lesson Start
- **File:** `/app/api/lessons/start/route.ts`
- **Action:** Add usage limit for free tier
- **Modification:**
```typescript
const usage = await prisma.userUsage.count({
  where: {
    userId: session.user.id,
    date: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }
});

if (session.user.tier === 'free' && usage >= 5) {
  return NextResponse.json(
    { error: 'Daily limit exceeded' },
    { status: 429 }
  );
}
```
- **Verification:** Free users limited to 5 lessons/day

### 5. Add Audio Duration Check
- **File:** `/app/api/lessons/[id]/submit-answer/route.ts`
- **Action:** Reject long audio files
- **Modification:**
```typescript
if (body.audioBlobUrl) {
  const audioDuration = await getAudioDuration(body.audioBlobUrl);
  if (audioDuration > 30) {
    return NextResponse.json(
      { error: 'Audio too long' },
      { status: 400 }
    );
  }
}
```
- **Verification:** Audio >30s is rejected