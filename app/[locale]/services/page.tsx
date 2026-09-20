import { notFound } from "next/navigation";
import Image from "next/image";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { Shell } from "@/components/shell";
import { getPublishedServices } from "@/features/services/public";
import { getSiteConfig } from "@/lib/env";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getRuntimeMessages } from "@/features/settings/ui-messages";
import { localeMetadata } from "@/lib/seo/metadata";
import { mediaPreviewPath } from "@/features/media/admin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getRuntimeMessages(locale);
  return localeMetadata(getSiteConfig().origin, locale, messages.services.title, "/services");
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, services] = await Promise.all([getRuntimeMessages(locale), getPublishedServices(locale)]);

  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={messages.services.title} eyebrow="WELL WAY" homeLabel={messages.services.home}/>
    <section className="inner-content-section" aria-labelledby="services-heading">
      <div className="site-container">
        <div className="section-heading">
          <p className="eyebrow">{messages.services.eyebrow}</p>
          <h2 id="services-heading">{messages.services.heading}</h2>
        </div>
        {services.length > 0 ? <div className="services-index-grid">
          {services.map((service, index) => <a className="service-index-card" href={localizedPath(locale, `/services/${service.slug}`)} key={service.id}>
            <span className="service-index-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="service-index-media">{service.service.image && <Image className="service-index-image" src={mediaPreviewPath(service.service.image.id, service.service.image.storageKey) ?? ""} alt="" width={640} height={360} unoptimized/>}</div>
            <div className="service-index-content"><h3>{service.title}</h3>{service.summary && <p>{service.summary}</p>}<span className="service-index-slug" dir="ltr">/{service.slug}</span><span className="service-card-action">{messages.home.servicesCarousel.viewDetails}</span></div>
          </a>)}
        </div> : <p className="empty-content">{messages.services.empty}</p>}
      </div>
    </section>
  </Shell>;
}
