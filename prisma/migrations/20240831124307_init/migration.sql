/*
  Warnings:

  - You are about to drop the column `currentChallenge` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Credential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Credential` DROP FOREIGN KEY `Credential_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transport` DROP FOREIGN KEY `Transport_credentialId_fkey`;

-- DropForeignKey
ALTER TABLE `Transport` DROP FOREIGN KEY `Transport_userId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `currentChallenge`;

-- DropTable
DROP TABLE `Credential`;

-- DropTable
DROP TABLE `Transport`;

-- CreateTable
CREATE TABLE `Passkey` (
    `id` VARCHAR(191) NOT NULL,
    `credentialId` VARCHAR(191) NOT NULL,
    `publicKey` LONGBLOB NOT NULL,
    `counter` BIGINT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Passkey_credentialId_key`(`credentialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Passkey` ADD CONSTRAINT `Passkey_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
