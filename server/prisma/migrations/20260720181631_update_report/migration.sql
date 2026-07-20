/*
  Warnings:

  - Changed the type of `strengths` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `weaknesses` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recommendations` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "strengths",
ADD COLUMN     "strengths" JSONB NOT NULL,
DROP COLUMN "weaknesses",
ADD COLUMN     "weaknesses" JSONB NOT NULL,
DROP COLUMN "recommendations",
ADD COLUMN     "recommendations" JSONB NOT NULL;
