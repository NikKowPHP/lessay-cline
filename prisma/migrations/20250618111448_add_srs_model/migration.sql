/*
  Warnings:

  - You are about to drop the column `language` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Progress` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `Progress` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `item` on the `SRSEntry` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `SRSEntry` table. All the data in the column will be lost.
  - You are about to drop the column `recallStrength` on the `SRSEntry` table. All the data in the column will be lost.
  - You are about to drop the column `nativeLang` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `targetLang` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Progress` table without a default value. This is not possible if the table is not empty.
  - Made the column `score` on table `Progress` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ease` to the `SRSEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interval` to the `SRSEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `SRSEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceAnalysis" DROP CONSTRAINT "VoiceAnalysis_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceAnalysis" DROP CONSTRAINT "VoiceAnalysis_userId_fkey";

-- DropIndex
DROP INDEX "Lesson_userId_difficulty_idx";

-- DropIndex
DROP INDEX "Progress_userId_completedAt_idx";

-- DropIndex
DROP INDEX "SRSEntry_userId_nextReview_idx";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "language",
DROP COLUMN "tags",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "completedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "completedAt",
DROP COLUMN "startedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SRSEntry" DROP COLUMN "item",
DROP COLUMN "language",
DROP COLUMN "recallStrength",
ADD COLUMN     "ease" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "interval" INTEGER NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL,
ALTER COLUMN "nextReview" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nativeLang",
DROP COLUMN "targetLang",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "UserProgress";

-- DropTable
DROP TABLE "VoiceAnalysis";
