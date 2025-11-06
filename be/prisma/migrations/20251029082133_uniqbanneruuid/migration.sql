/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Banner_uuid_key` ON `Banner`(`uuid`);
