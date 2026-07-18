/*
  Warnings:

  - You are about to drop the column `aiFeedback` on the `Report` table. All the data in the column will be lost.
  - Added the required column `problemSolving` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "aiFeedback",
ADD COLUMN     "problemSolving" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recommendations" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;
