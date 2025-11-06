-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_mentorId_fkey`;

-- DropIndex
DROP INDEX `transaction_mentorId_fkey` ON `transaction`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `mentorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `Mentor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
