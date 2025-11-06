/*
  Warnings:

  - A unique constraint covering the columns `[uuidtest]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Test_uuidtest_key` ON `Test`(`uuidtest`);
