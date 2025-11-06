/*
  Warnings:

  - You are about to drop the column `planId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_planId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_planId_fkey`;

-- DropIndex
DROP INDEX `User_planId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `planId`;

-- DropTable
DROP TABLE `Payment`;

-- DropTable
DROP TABLE `Plan`;
