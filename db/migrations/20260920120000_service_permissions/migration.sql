INSERT INTO `permissions` (`id`, `key`, `description`, `createdAt`, `updatedAt`) VALUES
('permission-services-create', 'services.create', 'Create services and draft translations', NOW(), NOW()),
('permission-services-update', 'services.update', 'Update services and draft translations', NOW(), NOW()),
('permission-services-archive', 'services.archive', 'Archive and restore services', NOW(), NOW()),
('permission-services-publish', 'services.publish', 'Publish service translations', NOW(), NOW())
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`), `updatedAt` = NOW();

INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`, `createdAt`)
SELECT `roles`.`id`, `permissions`.`id`, NOW()
FROM `roles` CROSS JOIN `permissions`
WHERE `roles`.`name` = 'ADMIN' AND `permissions`.`key` IN ('services.create', 'services.update', 'services.archive', 'services.publish');
