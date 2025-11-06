-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_useruuid_fkey` FOREIGN KEY (`useruuid`) REFERENCES `User`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
