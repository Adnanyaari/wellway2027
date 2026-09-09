import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/env";
import { localizedPath } from "@/lib/i18n/config";
import { getDefaultLocaleFromSettings } from "@/features/site-settings/public";

export default async function RootPage() {
  const fallback = getSiteConfig().defaultLocale;
  redirect(localizedPath(await getDefaultLocaleFromSettings(fallback)));
}
