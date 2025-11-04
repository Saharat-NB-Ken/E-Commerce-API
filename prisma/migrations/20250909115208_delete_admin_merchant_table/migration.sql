/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Merchant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_merchantId_fkey`;

-- DropIndex
DROP INDEX `Product_merchantId_fkey` ON `Product`;

-- DropTable
DROP TABLE `Admin`;

-- DropTable
DROP TABLE `Merchant`;
