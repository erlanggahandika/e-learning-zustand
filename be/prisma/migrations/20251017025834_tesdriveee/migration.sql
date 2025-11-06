/*
  Warnings:

  - Added the required column `amount` to the `PlanFeature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PlanFeature` ADD COLUMN `amount` INTEGER NOT NULL;
