import "server-only";
import { z } from "zod";
import { localeSchema } from "./i18n/config";

const originSchema = z.url().refine((value) => {
  const url = new URL(value);
  return !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash &&
    (url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)));
});
export function getSiteConfig() {
  const result = z.object({
    origin: originSchema,
    defaultLocale: localeSchema,
    indexable: z.enum(["true", "false"]),
  }).safeParse({ origin: process.env.SITE_URL ?? "http://localhost:3000",
    defaultLocale: process.env.DEFAULT_LOCALE ?? "ar", indexable: process.env.SITE_INDEXABLE ?? "false" });
  if (!result.success) throw new Error("Invalid site environment configuration");
  return { ...result.data, origin: new URL(result.data.origin).origin, indexable: result.data.indexable === "true" };
}
export function getDatabaseUrl() {
  const result = z.url().refine(value => new URL(value).protocol === "mysql:").safeParse(process.env.DATABASE_URL);
  if (!result.success) throw new Error("A valid MySQL DATABASE_URL is required");
  return result.data;
}
export function getAuthSecret() {
  const result = z.string().min(32).safeParse(process.env.BETTER_AUTH_SECRET);
  if (!result.success) throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters");
  return result.data;
}
