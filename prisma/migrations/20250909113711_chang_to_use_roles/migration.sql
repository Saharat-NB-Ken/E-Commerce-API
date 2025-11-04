-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_ownerId_fkey`;

-- DropIndex
DROP INDEX `Product_ownerId_fkey` ON `Product`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `merchantId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('USER', 'MERCHANT', 'ADMIN') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `Merchant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
