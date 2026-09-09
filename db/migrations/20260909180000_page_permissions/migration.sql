INSERT INTO `permissions` (`id`, `key`, `description`, `createdAt`, `updatedAt`) VALUES
('permission-pages-update', 'pages.update', 'Update page content', NOW(), NOW()),
('permission-pages-publish', 'pages.publish', 'Publish page translations', NOW(), NOW())
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`), `updatedAt` = NOW();

INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`, `createdAt`)
SELECT `roles`.`id`, `permissions`.`id`, NOW()
FROM `roles` CROSS JOIN `permissions`
WHERE `roles`.`name` = 'ADMIN' AND `permissions`.`key` IN ('pages.update', 'pages.publish');
