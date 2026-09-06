import "server-only";
import { notFound, redirect } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getPrincipal } from "./session";
import { hasPermission, type PermissionKey } from "./permissions";

export async function requirePermission(key: PermissionKey, locale: Locale) {
  const principal = await getPrincipal();
  if (!principal) redirect(localizedPath(locale, "/auth/login"));
  if (!hasPermission(principal, key)) notFound();
  return principal;
}
