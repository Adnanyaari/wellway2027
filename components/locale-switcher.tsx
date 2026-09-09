"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const segments = pathname.split("/");
  segments[1] = otherLocale;
  const targetPath = segments.join("/") || `/${otherLocale}`;

  return <a className="locale-switch" href={targetPath} lang={otherLocale} hrefLang={otherLocale}
    aria-label={label}>
    {otherLocale.toUpperCase()}
  </a>;
}
