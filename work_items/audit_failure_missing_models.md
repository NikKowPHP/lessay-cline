# Audit Failure: Missing Database Models

## Gap Description
The current database schema is missing two critical models required by the canonical specification:

1. **SRSEntry**: Manages spaced repetition schedules for vocabulary and grammar concepts
2. **VoiceAnalysis**: Stores metrics from diagnostic audio analysis

## Impact
These missing models prevent the system from:
- Tracking optimal review dates for learned content (SRS)
- Storing voice analysis metrics for fluency improvement

## Required Implementation
### 1. SRSEntry Model
```prisma
model SRSEntry {
  id          String   @id @default(cuid())
  userId      String
  itemId      String   // ID of vocabulary/grammar item
  nextReview  DateTime // Next optimal review date
  interval    Int      // Days until next review
  easeFactor  Float    // Difficulty rating (1.3-2.5)
  repetitions Int      // Number of times reviewed
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```

### 2. VoiceAnalysis Model
```prisma
model VoiceAnalysis {
  id             String   @id @default(cuid())
  userId         String
  recordingId    String   // ID of audio recording
  fluencyScore   Float    // Overall fluency rating
  hesitationRate Float    // Pauses per minute
  fillerWords    Int      // Count of filler words
  pronunciation  Json     // Detailed pronunciation scores
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  user           User     @relation(fields: [userId], references: [id])
}
```

## Verification Criteria
- Both models exist in `prisma/schema.prisma`
- Database migration has been applied
- Models are properly related to User model