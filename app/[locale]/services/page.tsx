import { notFound } from "next/navigation";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { Shell } from "@/components/shell";
import { getPublishedServices } from "@/features/services/public";
import { getSiteConfig } from "@/lib/env";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return localeMetadata(getSiteConfig().origin, locale, messages.services.title, "/services");
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, services] = [getMessages(locale), await getPublishedServices(locale)];

  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={messages.services.title} eyebrow="WELL WAY" homeLabel={messages.services.home}/>
    <section className="inner-content-section" aria-labelledby="services-heading">
      <div className="site-container">
        <div className="section-heading">
          <p className="eyebrow">{messages.services.eyebrow}</p>
          <h2 id="services-heading">{messages.services.heading}</h2>
        </div>
        {services.length > 0 ? <div className="services-index-grid">
          {services.map((service, index) => <article className="service-index-card" key={service.id}>
            <span className="service-index-number">{String(index + 1).padStart(2, "0")}</span>
            <h3>{service.title}</h3>
            {service.summary && <p>{service.summary}</p>}
            <span className="service-index-slug" dir="ltr">/{service.slug}</span>
          </article>)}
        </div> : <p className="empty-content">{messages.services.empty}</p>}
      </div>
    </section>
  </Shell>;
}
