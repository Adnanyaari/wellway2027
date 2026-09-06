import "server-only";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth/server";
import { getDb } from "@/db/client";
import type { Principal } from "./permissions";

export async function getPrincipal(): Promise<Principal | null> {
  const requestHeaders = await headers();
  // Unconfigured auth is closed, allowing a credential-free scaffold build.
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !requestHeaders.has("cookie")) return null;
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session || session.session.expiresAt <= new Date()) return null;
  // Fresh account state and grants on every check; no role-name bypass or browser authorization.
  const user = await getDb().user.findUnique({ where: { id: session.user.id }, select: {
    id: true, status: true, roles: { select: { role: { select: {
      permissions: { select: { permission: { select: { key: true } } } },
    } } } },
  } });
  if (!user || user.status !== "ACTIVE") return null;
  return { id: user.id, permissions: [...new Set(user.roles.flatMap(link =>
    link.role.permissions.map(grant => grant.permission.key)))] };
}
