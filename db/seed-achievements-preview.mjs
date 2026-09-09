import mysql from "mysql2/promise";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) throw new Error("DATABASE_URL is required");
const url = new URL(rawUrl);
if (!["127.0.0.1", "localhost", "::1"].includes(url.hostname)) throw new Error("Preview achievements may only be inserted into a local database");

const connection = await mysql.createConnection({ host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), database: decodeURIComponent(url.pathname.slice(1)) });
const source = "SYNTHETIC_LOCAL_PREVIEW:2026-09-08";
const achievements = [
  ["satisfied-clients", 500, "عميل راضٍ", "Satisfied clients"],
  ["successful-campaigns", 200, "حملة إعلانية ناجحة", "Successful ad campaigns"],
  ["brands", 10, "براندات", "Brands"],
  ["websites-stores", 300, "موقع ومتجر إلكتروني", "Websites and online stores"],
  ["visual-identities", 80, "هوية بصرية", "Visual identities"],
];

try {
  await connection.beginTransaction();
  for (const [index, [key, value, titleAr, titleEn]] of achievements.entries()) {
    const id = `achievement-${key}`;
    await connection.execute(`INSERT INTO achievements (id, value, prefix, suffix, position, status, sourceReference, approvedAt, createdAt, updatedAt)
      VALUES (?, ?, '+', NULL, ?, 'ACTIVE', ?, NULL, NOW(), NOW())
      ON DUPLICATE KEY UPDATE value=VALUES(value), prefix='+', suffix=NULL, position=VALUES(position), status='ACTIVE', sourceReference=VALUES(sourceReference), approvedAt=NULL, updatedAt=NOW()`, [id, value, index + 1, source]);
    for (const [locale, title, subtitle] of [["ar", titleAr, "بيانات تجريبية لمعاينة التصميم فقط"], ["en", titleEn, "Demo data for design preview only"]]) {
      await connection.execute(`INSERT INTO achievement_translations (id, achievementId, locale, title, subtitle, status, sourceReference, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, 'DRAFT', ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), status='DRAFT', sourceReference=VALUES(sourceReference), reviewedByReference=NULL, reviewedAt=NULL, publishedAt=NULL, updatedAt=NOW()`, [`achievement-${key}-${locale}`, id, locale, title, subtitle, source]);
    }
  }
  await connection.commit();
  console.log(`Inserted ${achievements.length} local preview achievements in two locales.`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
