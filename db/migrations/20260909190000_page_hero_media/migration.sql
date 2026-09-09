ALTER TABLE `page_translations`
  ADD COLUMN `heroLightMediaId` VARCHAR(36) NULL,
  ADD COLUMN `heroDarkMediaId` VARCHAR(36) NULL,
  ADD INDEX `page_translations_heroLightMediaId_idx` (`heroLightMediaId`),
  ADD INDEX `page_translations_heroDarkMediaId_idx` (`heroDarkMediaId`),
  ADD CONSTRAINT `page_translations_heroLightMediaId_fkey` FOREIGN KEY (`heroLightMediaId`) REFERENCES `media` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `page_translations_heroDarkMediaId_fkey` FOREIGN KEY (`heroDarkMediaId`) REFERENCES `media` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
