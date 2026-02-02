-- CreateTable
CREATE TABLE "SavingsAccount" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "principal" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "earnings" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "last_accrual_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingsAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavingsAccount_user_id_key" ON "SavingsAccount"("user_id");
