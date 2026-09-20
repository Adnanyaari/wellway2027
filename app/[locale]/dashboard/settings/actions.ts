"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requirePermission } from "@/features/auth/guards";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getUiMessageOverrides, isSafeMessageKey, UI_MESSAGES_SETTING_KEY } from "@/features/settings/ui-messages";
import { BRAND_ASSETS_SETTING_KEY } from "@/features/settings/brand-assets";
import { mediaPreviewPath } from "@/features/media/admin";
import { storeImage } from "@/features/media/storage";
import { companyContactSchema, getBrandAssets } from "@/features/site-settings/public";

const inputSchema = z.object({
  locale: z.string().refine(isLocale),
  key: z.string().trim().min(1).max(191).refine(isSafeMessageKey),
  ar: z.string().trim().min(1).max(2000),
  en: z.string().trim().min(1).max(2000),
});

export async function saveUiMessage(formData: FormData) {
  const input = inputSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return;
  const locale = input.data.locale as Locale;
  const principal = await requirePermission("settings.manage", locale);
  const overrides = await getUiMessageOverrides();
  overrides.ar[input.data.key] = input.data.ar;
  overrides.en[input.data.key] = input.data.en;
  await getDb().$transaction(async tx => {
    await tx.siteSetting.upsert({
      where: { key: UI_MESSAGES_SETTING_KEY },
      create: { key: UI_MESSAGES_SETTING_KEY, value: overrides },
      update: { value: overrides },
    });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "settings.ui_message.update", targetType: "siteSetting", targetId: input.data.key, outcome: "SUCCESS", metadata: { locales: ["ar", "en"] } } });
  });
  revalidatePath("/", "layout");
}

const brandInputSchema = z.object({
  locale: z.string().refine(isLocale),
  lightLogoId: z.string().trim().max(36),
  darkLogoId: z.string().trim().max(36),
  faviconId: z.string().trim().max(36),
});

export async function saveBrandAssets(formData: FormData) {
  const input = brandInputSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return;
  const locale = input.data.locale as Locale;
  const principal = await requirePermission("settings.manage", locale);
  const current = await getBrandAssets();
  let lightId = input.data.lightLogoId || current.light.mediaId;
  let darkId = input.data.darkLogoId || current.dark.mediaId;
  let faviconId = input.data.faviconId;
  const lightFile = formData.get("lightLogoFile");
  const darkFile = formData.get("darkLogoFile");
  const faviconFile = formData.get("faviconFile");
  if (lightFile instanceof File && lightFile.size) lightId = (await storeImage(principal, lightFile, "brand-logo-light")).id;
  if (darkFile instanceof File && darkFile.size) darkId = (await storeImage(principal, darkFile, "brand-logo-dark")).id;
  if (faviconFile instanceof File && faviconFile.size) faviconId = (await storeImage(principal, faviconFile, "brand-favicon")).id;

  const ids = [...new Set([lightId, darkId, faviconId].filter(Boolean))];
  const media = await getDb().media.findMany({
    where: { id: { in: ids }, status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } },
    select: { id: true, storageKey: true },
  });
  if (media.length !== ids.length) return;
  const byId = new Map(media.map(item => [item.id, item]));
  const asset = (id: string) => {
    const item = byId.get(id);
    const path = item && mediaPreviewPath(item.id, item.storageKey);
    if (!item || !path) throw new Error("INVALID_BRAND_MEDIA");
    return { mediaId: item.id, path };
  };
  const value = { light: asset(lightId), dark: asset(darkId), ...(faviconId ? { favicon: asset(faviconId) } : {}) };
  await getDb().$transaction(async tx => {
    await tx.siteSetting.upsert({
      where: { key: BRAND_ASSETS_SETTING_KEY },
      create: { key: BRAND_ASSETS_SETTING_KEY, value },
      update: { value },
    });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "settings.brand_assets.update", targetType: "siteSetting", targetId: BRAND_ASSETS_SETTING_KEY, outcome: "SUCCESS", metadata: { lightId, darkId, faviconId: faviconId || null } } });
  });
  revalidatePath("/", "layout");
}

const contactInputSchema = z.object({
  locale: z.string().refine(isLocale), primaryPhone: z.string().trim().max(40), unifiedPhone: z.string().trim().max(40), businessEmail: z.string().trim().max(191),
  addressAr: z.string().trim().max(1000), addressEn: z.string().trim().max(1000), whatsapp: z.string().trim().max(2048), mapUrl: z.string().trim().max(2048),
  workingHoursAr: z.string().trim().max(1000), workingHoursEn: z.string().trim().max(1000),
  instagram: z.string().trim().max(2048), x: z.string().trim().max(2048), linkedin: z.string().trim().max(2048), snapchat: z.string().trim().max(2048), tiktok: z.string().trim().max(2048), youtube: z.string().trim().max(2048),
});

export async function saveContactSettings(formData: FormData) {
  const input = contactInputSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return;
  const locale = input.data.locale as Locale;
  const principal = await requirePermission("settings.manage", locale);
  const optional = (value: string) => value || null;
  const value = companyContactSchema.safeParse({
    primaryPhone: optional(input.data.primaryPhone), unifiedPhone: optional(input.data.unifiedPhone), businessEmail: optional(input.data.businessEmail),
    address: { ar: optional(input.data.addressAr), en: optional(input.data.addressEn) }, whatsapp: optional(input.data.whatsapp), mapUrl: optional(input.data.mapUrl),
    workingHours: { ar: optional(input.data.workingHoursAr), en: optional(input.data.workingHoursEn) },
    social: { instagram: optional(input.data.instagram), x: optional(input.data.x), linkedin: optional(input.data.linkedin), snapchat: optional(input.data.snapchat), tiktok: optional(input.data.tiktok), youtube: optional(input.data.youtube) },
  });
  if (!value.success) return;
  await getDb().$transaction(async tx => {
    await tx.siteSetting.upsert({ where: { key: "company.contact" }, create: { key: "company.contact", value: value.data }, update: { value: value.data } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "settings.contact.update", targetType: "siteSetting", targetId: "company.contact", outcome: "SUCCESS", metadata: { groups: ["contact", "workingHours", "social"] } } });
  });
  revalidatePath("/", "layout");
}
