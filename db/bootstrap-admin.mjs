import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import mysql from "mysql2/promise";

const email = (process.env.INITIAL_ADMIN_EMAIL || "").trim().toLowerCase();
const phone = (process.env.INITIAL_ADMIN_PHONE || "").trim();
const password = process.env.INITIAL_ADMIN_PASSWORD || "";
const name = (process.env.INITIAL_ADMIN_NAME || "Well Way Admin").trim();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("INITIAL_ADMIN_EMAIL is invalid");
if (!/^\+?\d{8,15}$/.test(phone)) throw new Error("INITIAL_ADMIN_PHONE is invalid");
if (!password) throw new Error("INITIAL_ADMIN_PASSWORD is required and is never stored by this script");

const url = new URL(process.env.DATABASE_URL);
if (url.protocol !== "mysql:") throw new Error("DATABASE_URL must use mysql://");
const connection = await mysql.createConnection({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: decodeURIComponent(url.pathname.slice(1)),
});

const permissionKeys = [
  "dashboard.access", "analytics.read.aggregate", "users.manage", "roles.manage", "audit.read",
  "seo.read", "seo.update", "redirects.manage", "media.read", "media.upload", "media.delete",
  "leads.read.assigned", "leads.read.all", "leads.update.assigned", "leads.update.all",
  "leads.assign", "leads.export", "leads.delete",
];

try {
  const passwordHash = await hashPassword(password);
  await connection.beginTransaction();

  const [existing] = await connection.execute("SELECT `id` FROM `users` WHERE `email` = ? FOR UPDATE", [email]);
  const userId = existing[0]?.id || randomUUID();
  await connection.execute(
    `INSERT INTO users (id, name, email, phone, emailVerified, status, isProtected, mustChangePassword, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, true, 'ACTIVE', true, true, NOW(3), NOW(3))
     ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), emailVerified=true,
       status='ACTIVE', isProtected=true, mustChangePassword=true, updatedAt=NOW(3)`,
    [userId, name, email, phone],
  );

  const roleId = "role-admin";
  await connection.execute(
    `INSERT INTO roles (id, name, description, createdAt, updatedAt)
     VALUES (?, 'ADMIN', 'Protected owner administrator', NOW(3), NOW(3))
     ON DUPLICATE KEY UPDATE description=VALUES(description), updatedAt=NOW(3)`,
    [roleId],
  );
  const [roles] = await connection.execute("SELECT `id` FROM `roles` WHERE `name` = 'ADMIN' LIMIT 1");
  const actualRoleId = roles[0].id;

  for (const key of permissionKeys) {
    const permissionId = randomUUID();
    await connection.execute(
      `INSERT INTO permissions (id, \`key\`, description, createdAt, updatedAt)
       VALUES (?, ?, NULL, NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE updatedAt=NOW(3)`,
      [permissionId, key],
    );
    const [permissions] = await connection.execute("SELECT `id` FROM permissions WHERE `key` = ? LIMIT 1", [key]);
    await connection.execute(
      "INSERT IGNORE INTO role_permissions (roleId, permissionId, createdAt) VALUES (?, ?, NOW(3))",
      [actualRoleId, permissions[0].id],
    );
  }

  await connection.execute(
    "INSERT IGNORE INTO user_roles (userId, roleId, createdAt) VALUES (?, ?, NOW(3))",
    [userId, actualRoleId],
  );
  await connection.execute(
    `INSERT INTO protected_users (userId, reason, createdAt)
     VALUES (?, 'OWNER_ACCOUNT', NOW(3))
     ON DUPLICATE KEY UPDATE reason=VALUES(reason)`,
    [userId],
  );
  await connection.execute(
    `INSERT INTO accounts (id, accountId, providerId, userId, password, createdAt, updatedAt)
     VALUES (?, ?, 'credential', ?, ?, NOW(3), NOW(3))
     ON DUPLICATE KEY UPDATE userId=VALUES(userId), password=VALUES(password), updatedAt=NOW(3)`,
    [randomUUID(), userId, userId, passwordHash],
  );
  await connection.execute(
    `INSERT INTO audit_logs (id, actorId, action, targetType, targetId, outcome, metadata, createdAt)
     VALUES (?, ?, 'admin.bootstrap', 'user', ?, 'SUCCESS', ?, NOW(3))`,
    [randomUUID(), userId, userId, JSON.stringify({ protected: true, mustChangePassword: true })],
  );

  await connection.commit();
  console.log(`Protected administrator ready: ${email} (${phone}). Initial password must be changed on first sign-in.`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
