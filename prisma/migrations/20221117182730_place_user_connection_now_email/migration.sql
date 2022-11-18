-- DropForeignKey
ALTER TABLE `UserPlaceConnection` DROP FOREIGN KEY `UserPlaceConnection_userId_fkey`;

-- AddForeignKey
ALTER TABLE `UserPlaceConnection` ADD CONSTRAINT `UserPlaceConnection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
