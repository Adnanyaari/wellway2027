import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { AppThemeProvider } from "@/components/theme/provider";
import { getSiteConfig } from "@/lib/env";
import { direction, isLocale } from "@/lib/i18n/config";
import "./globals.css";

export const metadata: Metadata = { title: "Well Way 2027", robots: { index: false, follow: false } };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const candidate = requestHeaders.get("x-wellway-locale") ?? "";
  const locale = isLocale(candidate) ? candidate : getSiteConfig().defaultLocale;
  const theme = cookieStore.get("wellway-theme")?.value === "light" ? "light" : "dark";
  return <html lang={locale} dir={direction(locale)} className={theme} suppressHydrationWarning>
    <body><AppThemeProvider nonce={requestHeaders.get("x-nonce") ?? undefined}>{children}</AppThemeProvider></body>
  </html>;
}
