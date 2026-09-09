import "server-only";
import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";

export async function listClients(principal: Principal, query: string) {
  if (!hasPermission(principal, "clients.read")) throw new Error("FORBIDDEN");
  const search = query.trim().slice(0, 100);
  return getDb().client.findMany({
    where: search ? { OR: [
      { name: { contains: search } }, { translations: { some: { name: { contains: search } } } },
      { website: { contains: search } },
    ] } : undefined,
    orderBy: { updatedAt: "desc" }, take: 50,
    select: {
      id: true, name: true, website: true, status: true, updatedAt: true,
      lightLogo: { select: { id: true, storageKey: true } }, darkLogo: { select: { id: true, storageKey: true } },
      translations: { select: { locale: true, name: true, status: true }, orderBy: { locale: "asc" } },
      _count: { select: { projects: true } },
    },
  });
}

export async function listClientLogoMedia(principal: Principal) {
  if (!hasPermission(principal, "clients.read")) throw new Error("FORBIDDEN");
  return getDb().media.findMany({
    where: { status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, storageKey: true, purpose: true },
  });
}
