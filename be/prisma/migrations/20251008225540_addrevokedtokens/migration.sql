-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `revokedToken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `revokedToken` VARCHAR(191) NULL;
