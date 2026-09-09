import { notFound } from "next/navigation";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { NoImage } from "@/components/media/no-image";
import { Shell } from "@/components/shell";
import { getPublishedSectionEntries, isPublicSection } from "@/features/public-content/sections";
import { getSiteConfig } from "@/lib/env";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string; section: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, section } = await params;
  if (!isLocale(locale) || !isPublicSection(section)) notFound();
  const labels = getMessages(locale).pages[section];
  return localeMetadata(getSiteConfig().origin, locale, labels.title, `/${section}`);
}

export default async function PublicSectionPage({ params }: Props) {
  const { locale, section } = await params;
  if (!isLocale(locale) || !isPublicSection(section)) notFound();
  const messages = getMessages(locale);
  const labels = messages.pages[section];
  const entries = await getPublishedSectionEntries(section, locale);

  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={labels.title} eyebrow="WELL WAY" homeLabel={messages.services.home}/>
    <section className="inner-content-section" aria-labelledby="section-heading">
      <div className="site-container">
        <div className="section-heading"><p className="eyebrow">WELL WAY</p><h2 id="section-heading">{labels.heading}</h2></div>
        {entries.length === 0 ? <div className="empty-page-state"><NoImage label={labels.empty}/><p>{labels.empty}</p></div> :
          <div className="content-index-grid">{entries.map(entry => <article className="content-index-card" key={entry.id}>
            {entry.kind === "project" && <NoImage label={messages.pages.projects.noImage}/>}<h3>{entry.title}</h3>{entry.summary && <p>{entry.summary}</p>}
          </article>)}</div>}
      </div>
    </section>
  </Shell>;
}
