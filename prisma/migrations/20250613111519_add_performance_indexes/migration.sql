-- CreateIndex
CREATE INDEX "Lesson_userId_difficulty_idx" ON "Lesson"("userId", "difficulty");

-- CreateIndex
CREATE INDEX "Progress_userId_completedAt_idx" ON "Progress"("userId", "completedAt");
