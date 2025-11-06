-- AlterTable
ALTER TABLE `User` ADD COLUMN `notification_active` ENUM('active', 'nonActive') NOT NULL DEFAULT 'active';
