import "server-only";

import { z } from "zod";
import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";
import type { Locale } from "@/lib/i18n/config";
import { mediaPreviewPath } from "@/features/media/admin";

const internalPath = z.string().trim().min(1).max(255).regex(/^\/(?!\/)[^?#\\]*$/);
export const homeHeroSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    eyebrow: z.string().trim().max(100),
    headline: z.string().trim().min(2).max(191),
    description: z.string().trim().max(1000),
    primaryLabel: z.string().trim().min(1).max(100),
    primaryHref: internalPath,
    secondaryLabel: z.string().trim().min(1).max(100),
    secondaryHref: internalPath,
  }),
});
export type HomePageContent = z.infer<typeof homeHeroSchema>;

export function parseHomeContent(body: string | null): HomePageContent | null {
  if (!body) return null;
  try { return homeHeroSchema.parse(JSON.parse(body)); } catch { return null; }
}

export async function getHomePageAdmin(principal: Principal) {
  if (!hasPermission(principal, "pages.read")) throw new Error("FORBIDDEN");
  const page = await getDb().page.findUnique({
    where: { key: "home" },
    select: { id: true, status: true, translations: { select: { locale: true, title: true, body: true, status: true, updatedAt: true, heroLightMediaId: true, heroDarkMediaId: true }, orderBy: { locale: "asc" } } },
  });
  return page ? { ...page, translations: page.translations.map(item => ({ ...item, content: parseHomeContent(item.body) })) } : null;
}

export async function getPublishedHomeContent(locale: Locale) {
  const translation = await getDb().pageTranslation.findFirst({
    where: { locale, status: "PUBLISHED", page: { key: "home", status: "ACTIVE" } },
    select: { body: true, heroLightMedia: { select: { id: true, storageKey: true, isPublic: true, status: true } }, heroDarkMedia: { select: { id: true, storageKey: true, isPublic: true, status: true } } },
  });
  const content = parseHomeContent(translation?.body ?? null);
  if (!content || !translation) return null;
  const path = (media: typeof translation.heroLightMedia) => media?.isPublic && media.status === "ACTIVE" ? mediaPreviewPath(media.id, media.storageKey) : null;
  return { ...content, heroLightImage: path(translation.heroLightMedia), heroDarkImage: path(translation.heroDarkMedia) };
}

export async function listHeroMedia(principal: Principal) {
  if (!hasPermission(principal, "pages.read")) throw new Error("FORBIDDEN");
  return getDb().media.findMany({ where: { status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } }, orderBy: { updatedAt: "desc" }, take: 100, select: { id: true, storageKey: true } });
}
