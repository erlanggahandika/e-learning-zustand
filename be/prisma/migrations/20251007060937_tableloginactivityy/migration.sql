/*
  Warnings:

  - You are about to drop the `LoginActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `LoginActivity`;

-- CreateTable
CREATE TABLE `loginActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userUuid` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `deviceInfo` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'success',
    `loginMethod` VARCHAR(191) NULL,
    `loginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
