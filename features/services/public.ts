import "server-only";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";

export async function getPublishedServices(locale: Locale) {
  return getDb().serviceTranslation.findMany({
    where: { locale, status: "PUBLISHED", service: { status: "ACTIVE" } },
    select: { id: true, title: true, slug: true, summary: true },
    orderBy: { createdAt: "asc" },
  });
}
