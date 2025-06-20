-- DropIndex
DROP INDEX "Lesson_userId_difficulty_idx";

-- DropIndex
DROP INDEX "Progress_userId_completedAt_idx";

-- CreateTable
CREATE TABLE "LessonAnalysis" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "pronunciationScore" DOUBLE PRECISION,
    "weakPoints" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LessonAnalysis" ADD CONSTRAINT "LessonAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
