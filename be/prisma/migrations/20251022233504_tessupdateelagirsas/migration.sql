/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `notification_active` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExp` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `tokenJwt` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `tokenVersion` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `token_notification` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Notifikasi` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Notifikasi` DROP FOREIGN KEY `Notifikasi_adminId_fkey`;

-- DropIndex
DROP INDEX `Admin_email_key` ON `Admin`;

-- DropIndex
DROP INDEX `Admin_uuid_key` ON `Admin`;

-- DropIndex
DROP INDEX `Notifikasi_adminId_fkey` ON `Notifikasi`;

-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `email`,
    DROP COLUMN `lastLogin`,
    DROP COLUMN `notification_active`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`,
    DROP COLUMN `refreshTokenExp`,
    DROP COLUMN `tokenJwt`,
    DROP COLUMN `tokenVersion`,
    DROP COLUMN `token_notification`,
    DROP COLUMN `uuid`,
    ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notifikasi` DROP COLUMN `adminId`;
