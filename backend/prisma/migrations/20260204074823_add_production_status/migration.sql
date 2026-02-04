-- CreateEnum
CREATE TYPE "ProductionStageStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delayed');

-- AlterTable
ALTER TABLE "ProductionStage" ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "status" "ProductionStageStatus" NOT NULL DEFAULT 'pending';
