INSERT INTO `permissions` (`id`, `key`, `description`, `createdAt`, `updatedAt`)
VALUES ('permission-services-delete', 'services.delete', 'Permanently delete unreferenced services', NOW(), NOW())
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`), `updatedAt` = NOW();

INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`, `createdAt`)
SELECT `id`, 'permission-services-delete', NOW() FROM `roles` WHERE `name` = 'ADMIN';
