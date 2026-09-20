import "server-only";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";

export async function getPublishedServices(locale: Locale) {
  return getDb().serviceTranslation.findMany({
    where: { locale, status: "PUBLISHED", service: { status: "ACTIVE" } },
    select: { id: true, title: true, slug: true, summary: true, service: { select: { id: true, image: { select: { id: true, storageKey: true } } } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getPublishedService(locale: Locale, slug: string) {
  return getDb().serviceTranslation.findFirst({
    where: { locale, slug, status: "PUBLISHED", service: { status: "ACTIVE" } },
    select: {
      id: true, title: true, slug: true, summary: true, body: true, seoTitle: true, seoDescription: true,
      service: { select: {
        image: { select: { id: true, storageKey: true } },
        translations: { where: { status: "PUBLISHED" }, select: { locale: true, slug: true } },
      } },
    },
  });
}
