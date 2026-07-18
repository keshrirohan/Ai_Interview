/*
  Warnings:

  - You are about to drop the column `company` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "company",
ADD COLUMN     "currentQuestion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxQuestions" INTEGER NOT NULL DEFAULT 10;
