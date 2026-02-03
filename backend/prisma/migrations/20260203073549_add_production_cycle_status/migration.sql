/*
  Warnings:

  - The `status` column on the `ProductionCycle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductionCycleStatus" AS ENUM ('active', 'completed', 'paused', 'cancelled');

-- AlterTable
ALTER TABLE "ProductionCycle" DROP COLUMN "status",
ADD COLUMN     "status" "ProductionCycleStatus" NOT NULL DEFAULT 'active';
