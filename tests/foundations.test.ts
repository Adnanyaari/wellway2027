import { afterEach, describe, expect, it, vi } from "vitest";
import { direction, isLocale, localizedPath } from "@/lib/i18n/config";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import { canonicalUrl, localeMetadata, serializeStructuredData } from "@/lib/seo/metadata";
import { getAuthSecret, getDatabaseUrl, getMigrationDatabaseUrl, getSiteConfig } from "@/lib/env";
import { hasPermission, canAccessLead } from "@/features/auth/permissions";
import { contentSecurityPolicy } from "@/lib/security/csp";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { GET } from "@/app/api/health/route";

afterEach(() => vi.unstubAllEnvs());
describe("locales and SEO", () => {
  it("rejects unsupported locales and sets text direction", () => {
    expect(isLocale("ar")).toBe(true); expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false); expect(isLocale("AR")).toBe(false);
    expect(direction("ar")).toBe("rtl"); expect(direction("en")).toBe("ltr");
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
  });
  it("rejects external and tracking-bearing canonical paths", () => {
    expect(canonicalUrl("https://example.invalid", "ar", "/services")).toBe("https://example.invalid/ar/services");
    for (const path of ["//evil.invalid", "/en?utm_source=x", "/x#y", "https://evil.invalid", "/\\evil"]) {
      expect(() => localizedPath("ar", path)).toThrow();
    }
  });
  it("uses reciprocal alternates without indexing shells", () => {
    const metadata = localeMetadata("https://example.invalid", "en", "Well Way 2027");
    expect(metadata.alternates).toEqual({ canonical: "https://example.invalid/en", languages: {
      ar: "https://example.invalid/ar", en: "https://example.invalid/en",
    } });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(sitemap()).toEqual([]); expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });
  it("escapes script-closing sequences in structured data", () => {
    expect(serializeStructuredData({ value: "</script>" })).not.toContain("<");
  });
});
describe("server authorization policy", () => {
  it("denies anonymous and ungranted access, including a role name used as a grant", () => {
    expect(hasPermission(null, "dashboard.access")).toBe(false);
    expect(hasPermission({ id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false, permissions: ["ADMIN"] }, "dashboard.access")).toBe(false);
    expect(hasPermission({ id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false, permissions: ["dashboard.access"] }, "dashboard.access")).toBe(true);
  });
  it("enforces assignment and separates read from update", () => {
    const principal = { id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false, permissions: ["leads.read.assigned"] };
    expect(canAccessLead(principal, "read", "unit-user")).toBe(true);
    expect(canAccessLead(principal, "read", "another-unit-user")).toBe(false);
    expect(canAccessLead(principal, "read", null)).toBe(false);
    expect(canAccessLead(principal, "update", "unit-user")).toBe(false);
    expect(canAccessLead(null, "read", null)).toBe(false);
  });
});
describe("configuration and security", () => {
  it("rejects invalid environment values without echoing them", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://private-value");
    expect(() => getDatabaseUrl()).toThrow("DATABASE_URL must contain a complete MySQL connection URL");
    vi.stubEnv("MIGRATION_DATABASE_URL", "");
    expect(() => getMigrationDatabaseUrl()).toThrow("MIGRATION_DATABASE_URL must contain a complete MySQL connection URL");
    vi.stubEnv("BETTER_AUTH_SECRET", "short");
    expect(() => getAuthSecret()).toThrow("BETTER_AUTH_SECRET must contain at least 32 characters");
    vi.stubEnv("SITE_URL", "https://user:secret@example.invalid");
    expect(() => getSiteConfig()).toThrow("Invalid site environment configuration");
  });
  it("requires an explicit canonical origin in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SITE_URL", "");
    expect(() => getSiteConfig()).toThrow("Invalid site environment configuration");
  });
  it("keeps runtime and migration database connections separate", () => {
    vi.stubEnv("DATABASE_URL", "mysql://runtime-user:runtime-password@db.internal/runtime_db");
    vi.stubEnv("MIGRATION_DATABASE_URL", "mysql://migration-user:migration-password@db.internal/runtime_db");
    expect(getDatabaseUrl()).toContain("runtime-user");
    expect(getMigrationDatabaseUrl()).toContain("migration-user");
    expect(getDatabaseUrl()).not.toBe(getMigrationDatabaseUrl());
  });
  it("does not allow eval in production CSP", () => {
    const policy = contentSecurityPolicy("unit-nonce", false);
    expect(policy).toContain("'nonce-unit-nonce'"); expect(policy).not.toContain("unsafe-eval");
    expect(policy).toContain("frame-ancestors 'none'");
  });
  it("returns a minimal uncached liveness response", async () => {
    const response = GET();
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ status: "ok" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
  });
});
