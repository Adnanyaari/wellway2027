import "server-only";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";

export async function getPublishedAchievements(locale: Locale) {
  const isPreview = process.env.NODE_ENV !== "production";
  const rows = await getDb().achievementTranslation.findMany({
    where: isPreview
      ? { locale, status: "DRAFT", achievement: { status: "ACTIVE", approvedAt: null } }
      : { locale, status: "PUBLISHED", achievement: { status: "ACTIVE", approvedAt: { not: null } } },
    select: {
      id: true,
      title: true,
      subtitle: true,
      achievement: { select: { value: true, prefix: true, suffix: true, position: true } },
    },
    orderBy: { achievement: { position: "asc" } },
    take: 6,
  });
  return rows.map(row => ({ ...row, isPreview }));
}
