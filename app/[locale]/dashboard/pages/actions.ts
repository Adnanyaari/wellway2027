"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requirePermission } from "@/features/auth/guards";
import { homeHeroSchema, parseHomeContent } from "@/features/pages/home";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { storeImage } from "@/features/media/storage";

const saveSchema = z.object({
  locale: z.string().refine(isLocale), contentLocale: z.enum(["ar", "en"]),
  eyebrow: z.string(), headline: z.string(), description: z.string(),
  primaryLabel: z.string(), primaryHref: z.string(), secondaryLabel: z.string(), secondaryHref: z.string(),
  heroLightMediaId: z.string().trim().max(36).optional(), heroDarkMediaId: z.string().trim().max(36).optional(),
});

export async function saveHomeHero(formData: FormData) {
  const input = saveSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return;
  const locale = input.data.locale as Locale;
  const principal = await requirePermission("pages.update", locale);
  let lightMediaId = input.data.heroLightMediaId || "";
  let darkMediaId = input.data.heroDarkMediaId || "";
  const lightFile = formData.get("heroLightFile"); const darkFile = formData.get("heroDarkFile");
  if (lightFile instanceof File && lightFile.size) lightMediaId = (await storeImage(principal, lightFile, "home-hero-light")).id;
  if (darkFile instanceof File && darkFile.size) darkMediaId = (await storeImage(principal, darkFile, "home-hero-dark")).id;
  const mediaIds = [...new Set([lightMediaId, darkMediaId].filter(Boolean))];
  if (mediaIds.length && await getDb().media.count({ where: { id: { in: mediaIds }, status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } } }) !== mediaIds.length) return;
  const content = homeHeroSchema.safeParse({ version: 1, hero: {
    eyebrow: input.data.eyebrow, headline: input.data.headline, description: input.data.description,
    primaryLabel: input.data.primaryLabel, primaryHref: input.data.primaryHref,
    secondaryLabel: input.data.secondaryLabel, secondaryHref: input.data.secondaryHref,
  } });
  if (!content.success) return;
  const sourceReference = `DASHBOARD:${principal.id}`;
  await getDb().$transaction(async tx => {
    const page = await tx.page.upsert({ where: { key: "home" }, create: { key: "home", status: "ACTIVE" }, update: {}, select: { id: true } });
    const translation = await tx.pageTranslation.upsert({
      where: { pageId_locale: { pageId: page.id, locale: input.data.contentLocale } },
      create: { pageId: page.id, locale: input.data.contentLocale, title: input.data.headline.trim(), slug: "home", body: JSON.stringify(content.data), heroLightMediaId: lightMediaId || null, heroDarkMediaId: darkMediaId || null, status: "DRAFT", sourceReference },
      update: { title: input.data.headline.trim(), body: JSON.stringify(content.data), heroLightMediaId: lightMediaId || null, heroDarkMediaId: darkMediaId || null, status: "DRAFT", publishedAt: null, reviewedAt: null, reviewedByReference: null, sourceReference },
      select: { id: true },
    });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "page.home.update", targetType: "pageTranslation", targetId: translation.id, outcome: "SUCCESS", metadata: { locale: input.data.contentLocale } } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/pages"));
}

export async function setHomePublished(formData: FormData) {
  const input = z.object({ locale: z.string().refine(isLocale), contentLocale: z.enum(["ar", "en"]), published: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData));
  if (!input.success) return;
  const locale = input.data.locale as Locale;
  const principal = await requirePermission("pages.publish", locale);
  const publish = input.data.published === "true";
  await getDb().$transaction(async tx => {
    const translation = await tx.pageTranslation.findFirst({ where: { locale: input.data.contentLocale, page: { key: "home" } }, select: { id: true, body: true } });
    if (!translation || !parseHomeContent(translation.body)) throw new Error("INVALID_HOME_CONTENT");
    const now = new Date();
    await tx.pageTranslation.update({ where: { id: translation.id }, data: publish
      ? { status: "PUBLISHED", reviewedByReference: principal.id, reviewedAt: now, publishedAt: now }
      : { status: "DRAFT", publishedAt: null } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: publish ? "page.home.publish" : "page.home.unpublish", targetType: "pageTranslation", targetId: translation.id, outcome: "SUCCESS", metadata: { locale: input.data.contentLocale } } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/pages"));
  revalidatePath(localizedPath(input.data.contentLocale, ""));
}
