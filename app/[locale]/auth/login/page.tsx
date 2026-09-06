import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = privateMetadata;
export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return <Shell locale={locale}><h1 className="text-2xl font-semibold">{messages.authTitle}</h1><p>{messages.authPending}</p></Shell>;
}
