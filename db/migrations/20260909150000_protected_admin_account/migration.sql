-- Add administrator contact and account-safety state.
ALTER TABLE `users`
  ADD COLUMN `phone` VARCHAR(40) NULL,
  ADD COLUMN `isProtected` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `mustChangePassword` BOOLEAN NOT NULL DEFAULT false,
  ADD UNIQUE INDEX `users_phone_key`(`phone`);

-- A restrictive foreign key makes protected owners undeletable without elevated trigger privileges.
CREATE TABLE `protected_users` (
  `userId` VARCHAR(36) NOT NULL,
  `reason` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`userId`),
  CONSTRAINT `protected_users_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
