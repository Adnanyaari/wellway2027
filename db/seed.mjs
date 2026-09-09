import { stat } from "node:fs/promises";
import mysql from "mysql2/promise";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) throw new Error("DATABASE_URL is required");
const url = new URL(rawUrl);
if (url.protocol !== "mysql:") throw new Error("DATABASE_URL must use mysql://");
const connection = await mysql.createConnection({ host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), database: decodeURIComponent(url.pathname.slice(1)) });
const approvedAt = new Date("2026-09-08T00:00:00.000Z");
const source = "USER_CONFIRMED:2026-09-08";

const services = [
  ["marketing-consulting", "الاستشارات التسويقية والاستراتيجية", "Marketing Consulting & Strategy", "consultation", "تحليل التوجه التسويقي وبناء خطة عمل واضحة.", "Marketing direction analysis and clear action planning."],
  ["paid-advertising", "إدارة الحملات الإعلانية المدفوعة", "Paid Advertising Campaign Management", "ads", "تخطيط الحملات المدفوعة وإدارتها ومتابعة أدائها.", "Planning, managing, and monitoring paid campaigns."],
  ["web-ecommerce", "تطوير المواقع والمتاجر الإلكترونية", "Website & E-commerce Development", "websites", "تصميم وتطوير مواقع ومتاجر رقمية متجاوبة.", "Design and development of responsive websites and online stores."],
  ["influencer-marketing", "التسويق عبر المؤثرين", "Influencer Marketing", "influencer", "تنظيم حملات المؤثرين بما يناسب العلامة والجمهور.", "Organizing influencer campaigns around the brand and its audience."],
  ["creative-content", "إنتاج المحتوى الإبداعي والمرئي", "Creative & Visual Content Production", "creative", "إنتاج محتوى بصري وإبداعي للمنصات الرقمية.", "Creative and visual content production for digital platforms."],
  ["social-media", "إدارة حسابات التواصل الاجتماعي", "Social Media Management", "social", "تخطيط المحتوى وإدارة الحضور على منصات التواصل.", "Content planning and social media presence management."],
  ["brand-identity", "تصميم الهوية التجارية", "Brand Identity", "branding", "بناء هوية بصرية متناسقة تعبر عن العلامة.", "Building a consistent visual identity for the brand."],
  ["company-profile", "تصميم الملف التعريفي للشركات", "Company Profile Design", "profile", "إعداد ملف تعريفي منظم يعرض الشركة وخدماتها.", "Creating a structured profile that presents the company and its services."],
  ["seo", "تحسين محركات البحث", "Search Engine Optimization (SEO)", "seo", "تهيئة المحتوى والموقع لتحسين ظهوره في محركات البحث.", "Preparing content and websites for better search visibility."],
];
const clients = [
  ["catcator", "كاتكاتور", "Catcator"], ["safwat-aljouf", "صفوة الجوف", null],
  ["jeddah-deaf-club", "نادي الصم في جدة", null], ["sehatak-aham", "مختبرات صحتك أهم", null],
  ["sanad", "سند", "SANAD"], ["rare-feather", "الريشة النادرة", null],
  ["oud-ban", "عود بان", "OUD BAN"], ["lafhah", "لفحة للعطور", "LAFHAH"],
  ["casafelo", "كازافيلو", "Casafelo"], ["layan-home", "ليان هوم", "Layan Home"],
  ["al-fawaz", "الفواز للأقمشة", "Al Fawaz"], ["jstore", "جي ستور", "JStore"],
  ["art-square", "آرت سكوير", "Art Square"],
];

async function upsertMedia(id, storageKey, sizeBytes, width, height, purpose) {
  await connection.execute(`INSERT INTO media (id, storageKey, mimeType, sizeBytes, width, height, sourceReference, ownershipReference, purpose, isPublic, status, createdAt, updatedAt)
    VALUES (?, ?, 'image/svg+xml', ?, ?, ?, 'USER_ASSET:public/brand', ?, ?, true, 'ACTIVE', NOW(), NOW())
    ON DUPLICATE KEY UPDATE storageKey=VALUES(storageKey), sizeBytes=VALUES(sizeBytes), width=VALUES(width), height=VALUES(height), purpose=VALUES(purpose), isPublic=true, status='ACTIVE', updatedAt=NOW()`,
    [id, storageKey, sizeBytes, width, height, source, purpose]);
}

try {
  const [light, dark] = await Promise.all([stat("public/brand/wellway-logo-light.svg"), stat("public/brand/wellway-logo-dark.svg")]);
  await connection.beginTransaction();
  await upsertMedia("media-brand-logo-light", "brand/wellway-logo-light.svg", light.size, 658, 237, "brand-logo-light");
  await upsertMedia("media-brand-logo-dark", "brand/wellway-logo-dark.svg", dark.size, 800, 500, "brand-logo-dark");

  const settings = [
    ["setting-brand-logos", "brand.logos", { light: { mediaId: "media-brand-logo-light", path: "/brand/wellway-logo-light.svg" }, dark: { mediaId: "media-brand-logo-dark", path: "/brand/wellway-logo-dark.svg" } }],
    ["setting-localization", "localization", { defaultLocale: "ar", supportedLocales: ["ar", "en"] }],
    ["setting-company-contact", "company.contact", { primaryPhone: "+966550519484", unifiedPhone: "920014568", businessEmail: "bussiness@wellwaysa.com", address: { ar: "طريق الأمير محمد بن سلمان بن عبدالعزيز، الربيع، الرياض 13316، المملكة العربية السعودية", en: null }, whatsapp: null, social: {} }],
  ];
  for (const [id, key, value] of settings) await connection.execute(`INSERT INTO site_settings (id, \`key\`, value, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE value=VALUES(value), updatedAt=NOW()`, [id, key, JSON.stringify(value)]);

  for (const [key, titleAr, titleEn, slug, summaryAr, summaryEn] of services) {
    const serviceId = `service-${key}`;
    await connection.execute(`INSERT INTO services (id, status, createdAt, updatedAt) VALUES (?, 'ACTIVE', NOW(), NOW()) ON DUPLICATE KEY UPDATE status='ACTIVE', updatedAt=NOW()`, [serviceId]);
    for (const [locale, title, summary] of [["ar", titleAr, summaryAr], ["en", titleEn, summaryEn]]) await connection.execute(`INSERT INTO service_translations (id, serviceId, locale, title, summary, slug, status, sourceReference, reviewedByReference, reviewedAt, publishedAt, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, 'OWNER', ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE title=VALUES(title), summary=VALUES(summary), slug=VALUES(slug), status='PUBLISHED', sourceReference=VALUES(sourceReference), reviewedByReference='OWNER', reviewedAt=VALUES(reviewedAt), publishedAt=VALUES(publishedAt), updatedAt=NOW()`,
      [`st-${key}-${locale}`, serviceId, locale, title, summary, slug, source, approvedAt, approvedAt]);
  }

  for (const [key, nameAr, nameEn] of clients) {
    const clientId = `client-${key}`;
    await connection.execute(`INSERT INTO clients (id, name, sourceReference, approvedAt, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'ACTIVE', NOW(), NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name), sourceReference=VALUES(sourceReference), approvedAt=VALUES(approvedAt), status='ACTIVE', updatedAt=NOW()`, [clientId, nameAr, source, approvedAt]);
    for (const [locale, name] of [["ar", nameAr], ["en", nameEn]]) {
      if (!name) continue;
      await connection.execute(`INSERT INTO client_translations (id, clientId, locale, name, status, sourceReference, reviewedByReference, reviewedAt, publishedAt, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, 'PUBLISHED', ?, 'OWNER', ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE name=VALUES(name), status='PUBLISHED', sourceReference=VALUES(sourceReference), reviewedByReference='OWNER', reviewedAt=VALUES(reviewedAt), publishedAt=VALUES(publishedAt), updatedAt=NOW()`,
        [`ct-${key}-${locale}`, clientId, locale, name, source, approvedAt, approvedAt]);
    }
  }
  await connection.commit();
  console.log(`Seed complete: ${services.length} services, ${clients.length} clients, ${settings.length} settings, 2 brand media records.`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
