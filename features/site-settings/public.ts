import "server-only";
import { z } from "zod";
import { getDb } from "@/db/client";
import { localeSchema, type Locale } from "@/lib/i18n/config";

const publicAssetPath = z.string().refine(path => path.startsWith("/brand/") || path.startsWith("/media/"));
const brandAssetSchema = z.object({ mediaId: z.string().min(1), path: publicAssetPath });
const logosSchema = z.object({
  light: brandAssetSchema,
  dark: brandAssetSchema,
  favicon: brandAssetSchema.optional(),
});
const localizationSchema = z.object({ defaultLocale: localeSchema, supportedLocales: z.array(localeSchema).min(1) });
const optionalUrl = z.string().url().startsWith("https://").nullable().optional();
export const companyContactSchema = z.object({
  primaryPhone: z.string().min(1).nullable().optional(),
  unifiedPhone: z.string().min(1).nullable().optional(),
  businessEmail: z.string().email().nullable().optional(),
  address: z.object({ ar: z.string().min(1).nullable().optional(), en: z.string().min(1).nullable().optional() }).default({}),
  whatsapp: optionalUrl,
  mapUrl: optionalUrl,
  workingHours: z.object({ ar: z.string().max(1000).nullable().optional(), en: z.string().max(1000).nullable().optional() }).default({}),
  social: z.object({
    instagram: optionalUrl,
    x: optionalUrl,
    linkedin: optionalUrl,
    snapchat: optionalUrl,
    tiktok: optionalUrl,
    youtube: optionalUrl,
  }).default({}),
});
export type CompanyContact = z.infer<typeof companyContactSchema>;

export async function getBrandLogos() {
  const setting = await getDb().siteSetting.findUnique({ where: { key: "brand.logos" }, select: { value: true } });
  const result = logosSchema.safeParse(setting?.value);
  if (!result.success) throw new Error("The required brand.logos site setting is missing or invalid");
  return result.data;
}

export const getBrandAssets = getBrandLogos;

export async function getDefaultLocaleFromSettings(fallback: Locale) {
  const setting = await getDb().siteSetting.findUnique({ where: { key: "localization" }, select: { value: true } });
  const result = localizationSchema.safeParse(setting?.value);
  return result.success ? result.data.defaultLocale : fallback;
}

export async function getCompanyContact() {
  const setting = await getDb().siteSetting.findUnique({ where: { key: "company.contact" }, select: { value: true } });
  const result = companyContactSchema.safeParse(setting?.value);
  if (!result.success) throw new Error("The required company.contact site setting is missing or invalid");
  return result.data;
}
