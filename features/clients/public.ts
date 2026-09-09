import "server-only";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";

export async function getPublishedClients(locale: Locale) {
  return getDb().clientTranslation.findMany({
    where: { locale, status: "PUBLISHED", client: { status: "ACTIVE", approvedAt: { not: null } } },
    select: {
      id: true,
      name: true,
      client: {
        select: {
          lightLogo: { select: { id: true, storageKey: true, isPublic: true, status: true } },
          darkLogo: { select: { id: true, storageKey: true, isPublic: true, status: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}
