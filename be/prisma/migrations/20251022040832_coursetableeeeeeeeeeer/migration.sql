/*
  Warnings:

  - Added the required column `useruuid` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `useruuid` VARCHAR(191) NOT NULL;
