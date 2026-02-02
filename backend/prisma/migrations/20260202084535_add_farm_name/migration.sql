/*
  Warnings:

  - Added the required column `farm_name` to the `FarmProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FarmProfile" ADD COLUMN     "farm_name" VARCHAR(255) NOT NULL;
