-- DropIndex
DROP INDEX `Register_otp_key` ON `Register`;

-- AlterTable
ALTER TABLE `Register` MODIFY `otp` VARCHAR(191) NULL;
