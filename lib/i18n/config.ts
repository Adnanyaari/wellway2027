import { z } from "zod";

export const locales = ["ar", "en"] as const;
export const localeSchema = z.enum(locales);
export type Locale = z.infer<typeof localeSchema>;
export function isLocale(value: string): value is Locale {
  return localeSchema.safeParse(value).success;
}
export function direction(locale: Locale) { return locale === "ar" ? "rtl" : "ltr"; }
export function localizedPath(locale: Locale, path = "") {
  if (path && (!path.startsWith("/") || path.startsWith("//") || /[?#\\]/.test(path))) {
    throw new Error("Expected a local path without query or fragment");
  }
  return `/${locale}${path}`;
}
