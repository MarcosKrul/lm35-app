/*
  Warnings:

  - Added the required column `milliVolts` to the `lm35_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lm35_data" ADD COLUMN     "milliVolts" DOUBLE PRECISION NOT NULL;
