import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { requirePermission } from "@/features/auth/guards";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Protect the page itself; future data services must independently enforce their own capabilities.
  await requirePermission("dashboard.access", locale);
  return <Shell locale={locale}><h1 className="text-2xl font-semibold">{getMessages(locale).dashboard}</h1></Shell>;
}
