import { redirect } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { getSiteConfig } from "@/lib/env";
import { localizedPath } from "@/lib/i18n/config";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = privateMetadata;
export default async function DashboardEntry() {
  const locale = getSiteConfig().defaultLocale;
  await requirePermission("dashboard.access", locale);
  redirect(localizedPath(locale, "/dashboard"));
}
