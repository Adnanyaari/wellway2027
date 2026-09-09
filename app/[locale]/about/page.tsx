import Image from "next/image";
import { notFound } from "next/navigation";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { Shell } from "@/components/shell";
import { getPublishedSectionEntries } from "@/features/public-content/sections";
import { getBrandLogos, getCompanyContact } from "@/features/site-settings/public";
import { getSiteConfig } from "@/lib/env";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return localeMetadata(getSiteConfig().origin, locale, getMessages(locale).pages.about.title, "/about");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const labels = messages.aboutPage;
  const [logos, contact, publishedContent] = await Promise.all([
    getBrandLogos(),
    getCompanyContact(),
    getPublishedSectionEntries("about", locale),
  ]);
  const about = publishedContent[0] ?? null;
  const address = contact.address[locale];

  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={messages.pages.about.title} eyebrow="WELL WAY" homeLabel={messages.services.home}/>

    <section className="about-intro" aria-labelledby="about-intro-title">
      <div className="site-container about-intro-grid">
        <div className="about-intro-copy">
          <p className="eyebrow">{labels.eyebrow}</p>
          <h2 id="about-intro-title">{locale === "ar" ? "تسويق سعودي يوصلك بالعالم" : "WELL WAY"}</h2>
          {about?.summary
            ? <p className="about-published-copy">{about.summary}</p>
            : <div className="about-content-pending" role="status">
                <span aria-hidden="true">01</span>
                <p>{labels.contentPending}</p>
              </div>}
        </div>

        <div className="about-brand-panel" aria-label={labels.brandPanel}>
          <div className="about-brand-orbit" aria-hidden="true"><span/><span/><span/></div>
          <Image className="about-logo-light" src={logos.light.path} width={658} height={237} alt="WELL WAY" priority/>
          <Image className="about-logo-dark" src={logos.dark.path} width={658} height={237} alt="WELL WAY" priority/>
          <p>{labels.companyName}</p>
        </div>
      </div>
    </section>

    <section className="about-contact-band" aria-labelledby="about-contact-title">
      <div className="site-container about-contact-grid">
        <div>
          <p className="eyebrow">{labels.contactEyebrow}</p>
          <h2 id="about-contact-title">{labels.contactTitle}</h2>
        </div>
        <dl className="about-contact-list">
          {address && <div><dt>{labels.address}</dt><dd>{address}</dd></div>}
          {contact.businessEmail && <div><dt>{labels.email}</dt><dd><a href={`mailto:${contact.businessEmail}`} dir="ltr">{contact.businessEmail}</a></dd></div>}
          {contact.primaryPhone && <div><dt>{labels.phone}</dt><dd><a href={`tel:${contact.primaryPhone.replace(/[^+\d]/g, "")}`} dir="ltr">{contact.primaryPhone}</a></dd></div>}
        </dl>
        <a className="button button-primary about-contact-cta" href={localizedPath(locale, "/contact")}>{labels.contactCta}</a>
      </div>
    </section>
  </Shell>;
}
