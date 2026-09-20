import "server-only";

import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";
import { mediaPreviewPath } from "@/features/media/admin";

export const BRAND_ASSETS_SETTING_KEY = "brand.logos";

export async function listBrandMedia(principal: Principal) {
  if (!hasPermission(principal, "settings.manage")) throw new Error("FORBIDDEN");
  const media = await getDb().media.findMany({
    where: { status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, storageKey: true, mimeType: true },
  });
  return media.flatMap(item => {
    const previewPath = mediaPreviewPath(item.id, item.storageKey);
    return previewPath ? [{ ...item, previewPath }] : [];
  });
}
