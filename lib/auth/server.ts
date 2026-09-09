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
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      // The protected owner has an explicitly approved one-time 4-digit credential.
      // New passwords are independently required to contain at least 6 characters.
      minPasswordLength: 4,
      maxPasswordLength: 128,
    },
    rateLimit: {
      enabled: true,
      storage: "memory",
      window: 60,
      max: 20,
      customRules: { "/sign-in/email": { window: 60, max: 5 } },
    },
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
