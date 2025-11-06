/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Notifikasi` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Notifikasi` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Notifikasi_uuid_key` ON `Notifikasi`(`uuid`);
