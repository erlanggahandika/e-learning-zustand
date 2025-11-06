/*
  Warnings:

  - Added the required column `courseuuid` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Meeting` ADD COLUMN `courseuuid` VARCHAR(191) NOT NULL;
