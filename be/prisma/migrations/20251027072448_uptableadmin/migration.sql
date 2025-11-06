-- CreateTable
CREATE TABLE `SuperUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `hakAkses` VARCHAR(191) NULL,
    `tokenJwt` TEXT NULL,
    `lastLogin` DATETIME(3) NULL,
    `token_notification` VARCHAR(191) NULL,
    `refreshTokenExp` DATETIME(3) NULL,
    `plan` INTEGER NULL DEFAULT 1,
    `tokenVersion` INTEGER NULL DEFAULT 0,
    `uuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notification_active` ENUM('active', 'nonActive') NOT NULL DEFAULT 'active',

    UNIQUE INDEX `SuperUser_email_key`(`email`),
    UNIQUE INDEX `SuperUser_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
