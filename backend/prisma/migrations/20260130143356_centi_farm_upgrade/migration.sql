/*
  Warnings:

  - The values [needs,wants] on the enum `BudgetBucket` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `needs_balance` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `savings_balance` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `wants_balance` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `UserRatio` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BudgetBucket_new" AS ENUM ('farm_inputs', 'farm_labor', 'farm_operations', 'livestock_feed', 'livestock_health', 'household', 'savings');
ALTER TABLE "WalletTransaction" ALTER COLUMN "bucket" TYPE "BudgetBucket_new" USING ("bucket"::text::"BudgetBucket_new");
ALTER TYPE "BudgetBucket" RENAME TO "BudgetBucket_old";
ALTER TYPE "BudgetBucket_new" RENAME TO "BudgetBucket";
DROP TYPE "public"."BudgetBucket_old";
COMMIT;

-- DropIndex
DROP INDEX "WalletTransaction_bucket_idx";

-- DropIndex
DROP INDEX "WalletTransaction_type_idx";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "needs_balance",
DROP COLUMN "savings_balance",
DROP COLUMN "wants_balance";

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "cycle_id" INTEGER,
ADD COLUMN     "stage_id" INTEGER;

-- DropTable
DROP TABLE "UserRatio";

-- CreateTable
CREATE TABLE "FarmProfile" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "farm_type" TEXT NOT NULL,
    "main_activity" TEXT NOT NULL,
    "farm_size" DOUBLE PRECISION,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionCycle" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "farm_profile_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cycle_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "expected_end" TIMESTAMP(3),
    "expected_income" DECIMAL(10,2),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionStage" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "planned_cost" DECIMAL(10,2) NOT NULL,
    "actual_cost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmIncome" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "expected_amount" DECIMAL(10,2),
    "actual_amount" DECIMAL(10,2),
    "sale_date" TIMESTAMP(3),
    "buyer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FarmIncome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarmProfile_user_id_key" ON "FarmProfile"("user_id");

-- CreateIndex
CREATE INDEX "ProductionCycle_user_id_idx" ON "ProductionCycle"("user_id");

-- CreateIndex
CREATE INDEX "ProductionCycle_farm_profile_id_idx" ON "ProductionCycle"("farm_profile_id");

-- CreateIndex
CREATE INDEX "ProductionStage_cycle_id_idx" ON "ProductionStage"("cycle_id");

-- CreateIndex
CREATE INDEX "FarmIncome_cycle_id_idx" ON "FarmIncome"("cycle_id");

-- CreateIndex
CREATE INDEX "Payment_user_id_idx" ON "Payment"("user_id");

-- CreateIndex
CREATE INDEX "WalletTransaction_cycle_id_idx" ON "WalletTransaction"("cycle_id");

-- CreateIndex
CREATE INDEX "WalletTransaction_stage_id_idx" ON "WalletTransaction"("stage_id");

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "ProductionCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "ProductionStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionCycle" ADD CONSTRAINT "ProductionCycle_farm_profile_id_fkey" FOREIGN KEY ("farm_profile_id") REFERENCES "FarmProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionStage" ADD CONSTRAINT "ProductionStage_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "ProductionCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmIncome" ADD CONSTRAINT "FarmIncome_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "ProductionCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
