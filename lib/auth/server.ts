import "server-only";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { getDb } from "@/db/client";
import { getAuthSecret, getSiteConfig } from "@/lib/env";

function createAuth() {
  const { origin } = getSiteConfig();
  return betterAuth({
    appName: "Well Way 2027",
    baseURL: origin,
    secret: getAuthSecret(),
    database: prismaAdapter(getDb(), { provider: "mysql" }),
    trustedOrigins: [origin],
    // Session-reading foundation only. No registration, login, recovery or OAuth endpoints exposed.
    emailAndPassword: { enabled: false },
    session: { cookieCache: { enabled: false }, expiresIn: 60 * 60 * 8 },
    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax", path: "/" },
      database: { generateId: "uuid" },
    },
  });
}
let auth: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return auth ??= createAuth(); }
