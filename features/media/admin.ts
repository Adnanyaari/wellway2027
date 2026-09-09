import "server-only";

import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";

export async function listMedia(principal: Principal) {
  if (!hasPermission(principal, "media.read")) throw new Error("FORBIDDEN");
  return getDb().media.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true, storageKey: true, mimeType: true, sizeBytes: true, width: true, height: true,
      purpose: true, isPublic: true, status: true, updatedAt: true,
      _count: { select: { lightLogoClients: true, darkLogoClients: true, projects: true } },
    },
  });
}

export function publicMediaPath(storageKey: string) {
  if (storageKey.includes("..") || storageKey.includes("\\") || !/^[a-zA-Z0-9/_\-.]+$/.test(storageKey)) return null;
  return `/${storageKey.replace(/^\/+/, "")}`;
}

export function mediaPreviewPath(id: string, storageKey: string) {
  return storageKey.startsWith("uploads/") ? `/media/${encodeURIComponent(id)}` : publicMediaPath(storageKey);
}
