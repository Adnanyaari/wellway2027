import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { Shell } from "@/components/shell";
import { mediaPreviewPath } from "@/features/media/admin";
import { getPublishedService } from "@/features/services/public";
import { getRuntimeMessages } from "@/features/settings/ui-messages";
import { getSiteConfig } from "@/lib/env";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { canonicalUrl, privateMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = await getPublishedService(locale, slug);
  if (!service) notFound();
  const origin = getSiteConfig().origin;
  const path = `/services/${service.slug}`;
  const languages = Object.fromEntries(service.service.translations.map(item => [item.locale, canonicalUrl(origin, item.locale, `/services/${item.slug}`)]));
  const title = service.seoTitle || service.title;
  const description = service.seoDescription || service.summary || undefined;
  return { metadataBase: new URL(origin), title, description,
    alternates: { canonical: canonicalUrl(origin, locale, path), languages },
    openGraph: { type: "website", title, description, url: canonicalUrl(origin, locale, path), locale: locale === "ar" ? "ar_SA" : "en_US" },
    ...privateMetadata };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [service, messages] = await Promise.all([getPublishedService(locale, slug), getRuntimeMessages(locale)]);
  if (!service) notFound();
  const image = service.service.image ? mediaPreviewPath(service.service.image.id, service.service.image.storageKey) : null;
  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={service.title} eyebrow={messages.services.eyebrow} homeLabel={messages.services.home}/>
    <main className="service-detail-section"><div className="site-container service-detail-layout">
      {image && <div className="service-detail-image"><Image src={image} alt="" width={1200} height={720} priority unoptimized/></div>}
      <article className="service-detail-copy">{service.summary && <p className="service-detail-summary">{service.summary}</p>}{service.body && <div className="service-detail-body">{service.body}</div>}<a className="button button-primary" href={localizedPath(locale, "/contact")}>{messages.home.startProject}</a></article>
    </div></main>
  </Shell>;
}
