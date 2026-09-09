INSERT INTO `permissions` (`id`, `key`, `description`, `createdAt`, `updatedAt`)
VALUES ('permission-clients-publish', 'clients.publish', 'Publish client translations', NOW(), NOW())
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`), `updatedAt` = NOW();

INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`, `createdAt`)
SELECT `id`, 'permission-clients-publish', NOW() FROM `roles` WHERE `name` = 'ADMIN';
