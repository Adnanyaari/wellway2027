import type { Metadata } from "next";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export const privateMetadata: Metadata = { robots: { index: false, follow: false } };
export function canonicalUrl(origin: string, locale: Locale, path = "") {
  return new URL(localizedPath(locale, path), origin).toString();
}
export function localeMetadata(origin: string, locale: Locale, title: string): Metadata {
  return {
    metadataBase: new URL(origin), title,
    alternates: { canonical: canonicalUrl(origin, locale), languages: {
      ar: canonicalUrl(origin, "ar"), en: canonicalUrl(origin, "en"),
    } },
    openGraph: { type: "website", title, url: canonicalUrl(origin, locale),
      locale: locale === "ar" ? "ar_SA" : "en_US", alternateLocale: locale === "ar" ? "en_US" : "ar_SA" },
    ...privateMetadata,
  };
}
export function serializeStructuredData(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
