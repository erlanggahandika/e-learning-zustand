/*
  Warnings:

  - You are about to drop the column `email` on the `Notifikasi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notifikasi` DROP COLUMN `email`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
