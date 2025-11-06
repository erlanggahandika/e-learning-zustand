-- AlterTable
ALTER TABLE `webinar` ADD COLUMN `isCommunity` INTEGER NULL DEFAULT 0,
    MODIFY `platform` VARCHAR(191) NULL,
    MODIFY `time` DATETIME(3) NULL;
