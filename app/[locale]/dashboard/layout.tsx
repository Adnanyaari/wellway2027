import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { isLocale } from "@/lib/i18n/config";
import { privateMetadata } from "@/lib/seo/metadata";
import { localizedPath } from "@/lib/i18n/config";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata = privateMetadata;
export default async function DashboardLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await requirePermission("dashboard.access", locale);
  if (principal.mustChangePassword) redirect(localizedPath(locale, "/auth/change-password"));
  return <DashboardShell locale={locale} principal={principal}>{children}</DashboardShell>;
}
