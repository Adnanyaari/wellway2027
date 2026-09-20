import Image from "next/image";
import { notFound } from "next/navigation";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { AboutScrollStory } from "@/components/about/about-scroll-story";
import { Shell } from "@/components/shell";
import { getPublishedSectionEntries } from "@/features/public-content/sections";
import { getBrandLogos, getCompanyContact } from "@/features/site-settings/public";
import { getSiteConfig } from "@/lib/env";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getRuntimeMessages } from "@/features/settings/ui-messages";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return localeMetadata(getSiteConfig().origin, locale, (await getRuntimeMessages(locale)).pages.about.title, "/about");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, logos, contact, publishedContent] = await Promise.all([
    getRuntimeMessages(locale),
    getBrandLogos(),
    getCompanyContact(),
    getPublishedSectionEntries("about", locale),
  ]);
  const labels = messages.aboutPage;
  const about = publishedContent[0] ?? null;
  const address = contact.address[locale];
  const phoneNumber = contact.primaryPhone?.replace(/[^+\d]/g, "") ?? null;
  const whatsappNumber = contact.primaryPhone?.replace(/\D/g, "") ?? null;
  const whatsappHref = contact.whatsapp ?? (whatsappNumber ? `https://wa.me/${whatsappNumber}` : null);

  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={messages.pages.about.title} eyebrow="WELL WAY" homeLabel={messages.services.home}/>

    <section className="about-intro" aria-labelledby="about-intro-title">
      <div className="site-container about-intro-stage">
        <div className="about-intro-index" aria-hidden="true"><span>WELL WAY</span><b>2027</b></div>
        <div className="about-intro-copy">
          <p className="eyebrow">{labels.eyebrow}</p>
          <h2 id="about-intro-title">{labels.headline}</h2>
          <div className="about-intro-actions">
            {phoneNumber && <a className="button button-primary" href={`tel:${phoneNumber}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/></svg>
              {labels.callCta}
            </a>}
            {whatsappHref && <a className="button about-whatsapp-cta" href={whatsappHref} target="_blank" rel="noreferrer">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.93L.1 24l6.33-1.66a11.86 11.86 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.22-6.16-3.45-8.42Zm-8.43 18.29h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.76.99 1-3.66-.24-.38a9.82 9.82 0 0 1-1.5-5.26c0-5.45 4.43-9.88 9.89-9.88a9.8 9.8 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.87-9.88 9.87Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.91 8.91 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.3.18-1.42-.08-.13-.27-.2-.57-.35Z"/></svg>
              {labels.whatsappCta}
            </a>}
          </div>
        </div>
        <div className="about-brand-watermark" aria-label={labels.brandPanel}>
          <div className="about-brand-orbit" aria-hidden="true"><span/><span/><span/></div>
          <Image className="about-logo-light" src={logos.light.path} width={658} height={237} alt="WELL WAY" priority/>
          <Image className="about-logo-dark" src={logos.dark.path} width={658} height={237} alt="WELL WAY" priority/>
        </div>
        <div className="about-intro-statement"><span aria-hidden="true">01</span><p>{about?.summary || labels.intro}</p><small>{labels.companyName}</small></div>
      </div>
    </section>

    <AboutScrollStory eyebrow={labels.methodEyebrow} title={labels.methodTitle} principles={labels.principles}/>

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
