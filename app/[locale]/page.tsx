import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { getSiteConfig } from "@/lib/env";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return localeMetadata(getSiteConfig().origin, locale, getMessages(locale).title);
}
export default async function LocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return <Shell locale={locale}><h1 className="text-2xl font-semibold">{messages.title}</h1><p>{messages.pending}</p></Shell>;
}
