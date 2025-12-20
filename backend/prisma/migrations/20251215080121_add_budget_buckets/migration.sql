-- CreateEnum
CREATE TYPE "BudgetBucket" AS ENUM ('needs', 'wants', 'savings');

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "needs_balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "savings_balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "wants_balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "bucket" "BudgetBucket";

-- CreateIndex
CREATE INDEX "WalletTransaction_bucket_idx" ON "WalletTransaction"("bucket");
