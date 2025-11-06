-- CreateTable
CREATE TABLE `joinwebinar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `userUuid` VARCHAR(191) NOT NULL,
    `webinarUuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `joinwebinar_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `joinwebinar` ADD CONSTRAINT `joinwebinar_webinarUuid_fkey` FOREIGN KEY (`webinarUuid`) REFERENCES `webinar`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
