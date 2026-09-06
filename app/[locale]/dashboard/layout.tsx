import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { isLocale } from "@/lib/i18n/config";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = privateMetadata;
export default async function DashboardLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requirePermission("dashboard.access", locale);
  return children;
}
