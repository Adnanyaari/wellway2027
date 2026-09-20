import "server-only";

import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";

export async function listServices(principal: Principal, query: string) {
  if (!hasPermission(principal, "services.read")) throw new Error("FORBIDDEN");
  const search = query.trim().slice(0, 100);
  return getDb().service.findMany({
    where: search ? { translations: { some: { OR: [
      { title: { contains: search } }, { slug: { contains: search } }, { summary: { contains: search } },
    ] } } } : undefined,
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true, imageId: true, status: true, updatedAt: true,
      image: { select: { id: true, storageKey: true } },
      translations: { select: { locale: true, title: true, summary: true, body: true, slug: true, seoTitle: true, seoDescription: true, status: true }, orderBy: { locale: "asc" } },
      _count: { select: { projects: true, leads: true } },
    },
  });
}

export async function listServiceMedia(principal: Principal) {
  if (!hasPermission(principal, "services.read")) throw new Error("FORBIDDEN");
  return getDb().media.findMany({
    where: { status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } },
    orderBy: { updatedAt: "desc" }, take: 100,
    select: { id: true, storageKey: true, purpose: true },
  });
}
