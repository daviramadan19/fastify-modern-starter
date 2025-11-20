-- AlterTable
ALTER TABLE `permissions` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `roles` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `updatedAt` DROP DEFAULT;
