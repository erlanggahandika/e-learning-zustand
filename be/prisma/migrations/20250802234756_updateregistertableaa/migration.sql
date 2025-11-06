/*
  Warnings:

  - You are about to drop the `EmailOtp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `EmailOtp`;

-- CreateTable
CREATE TABLE `emailOtp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `expiredAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emailOtp_email_key`(`email`),
    UNIQUE INDEX `emailOtp_otp_key`(`otp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
