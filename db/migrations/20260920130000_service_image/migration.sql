ALTER TABLE `services` ADD COLUMN `imageId` VARCHAR(36) NULL;

CREATE INDEX `services_imageId_idx` ON `services`(`imageId`);

ALTER TABLE `services`
ADD CONSTRAINT `services_imageId_fkey`
FOREIGN KEY (`imageId`) REFERENCES `media`(`id`)
ON DELETE RESTRICT ON UPDATE CASCADE;
