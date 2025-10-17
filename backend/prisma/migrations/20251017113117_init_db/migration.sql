-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('income', 'expense', 'allocation');

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "public"."TransactionType" NOT NULL DEFAULT 'expense',
    "parent_id" INTEGER,
    "created_at" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRatio" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "needs_percent" INTEGER NOT NULL,
    "wants_percent" INTEGER NOT NULL,
    "savings_percent" INTEGER NOT NULL,
    "created_at" DATE DEFAULT CURRENT_DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRatio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_user_id_idx" ON "public"."Transaction"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRatio_user_id_key" ON "public"."UserRatio"("user_id");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
