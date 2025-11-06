/*
  Warnings:

  - You are about to drop the column `image` on the `webinar` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `webinar` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `webinar` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `webinar` table. All the data in the column will be lost.
  - Added the required column `desc` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speaker` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumb` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `webinar` table without a default value. This is not possible if the table is not empty.
  - Made the column `uuid` on table `webinar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `webinar` DROP COLUMN `image`,
    DROP COLUMN `level`,
    DROP COLUMN `name`,
    DROP COLUMN `sortOrder`,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `duration` VARCHAR(191) NOT NULL,
    ADD COLUMN `platform` VARCHAR(191) NOT NULL,
    ADD COLUMN `sort` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `speaker` VARCHAR(191) NOT NULL,
    ADD COLUMN `thumb` VARCHAR(191) NOT NULL,
    ADD COLUMN `time` DATETIME(3) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userUuid` VARCHAR(191) NOT NULL,
    MODIFY `uuid` VARCHAR(191) NOT NULL;
