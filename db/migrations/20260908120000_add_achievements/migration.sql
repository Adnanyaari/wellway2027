-- CreateTable
CREATE TABLE `achievements` (
    `id` VARCHAR(36) NOT NULL,
    `value` INTEGER NOT NULL,
    `prefix` VARCHAR(16) NULL,
    `suffix` VARCHAR(16) NULL,
    `position` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `sourceReference` TEXT NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `achievements_position_key`(`position`),
    INDEX `achievements_status_position_idx`(`status`, `position`),
    CONSTRAINT `achievements_value_nonnegative` CHECK (`value` >= 0),
    CONSTRAINT `achievements_position_range` CHECK (`position` BETWEEN 1 AND 6),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievement_translations` (
    `id` VARCHAR(36) NOT NULL,
    `achievementId` VARCHAR(36) NOT NULL,
    `locale` ENUM('ar', 'en') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `sourceReference` TEXT NULL,
    `reviewedByReference` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `achievement_translations_achievementId_locale_key`(`achievementId`, `locale`),
    INDEX `achievement_translations_locale_status_idx`(`locale`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `achievement_translations` ADD CONSTRAINT `achievement_translations_achievementId_fkey` FOREIGN KEY (`achievementId`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
