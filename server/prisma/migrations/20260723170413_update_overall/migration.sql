/*
  Warnings:

  - You are about to drop the column `averageScore` on the `OverallReport` table. All the data in the column will be lost.
  - You are about to drop the column `highestScore` on the `OverallReport` table. All the data in the column will be lost.
  - You are about to drop the column `lowestScore` on the `OverallReport` table. All the data in the column will be lost.
  - You are about to drop the column `strongestSkill` on the `OverallReport` table. All the data in the column will be lost.
  - You are about to drop the column `weakestSkill` on the `OverallReport` table. All the data in the column will be lost.
  - Added the required column `communication` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidence` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallScore` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemSolving` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strengths` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technical` to the `OverallReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weaknesses` to the `OverallReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OverallReport" DROP COLUMN "averageScore",
DROP COLUMN "highestScore",
DROP COLUMN "lowestScore",
DROP COLUMN "strongestSkill",
DROP COLUMN "weakestSkill",
ADD COLUMN     "communication" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "problemSolving" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recommendations" JSONB NOT NULL,
ADD COLUMN     "strengths" JSONB NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "technical" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weaknesses" JSONB NOT NULL;
