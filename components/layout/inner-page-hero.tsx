import { localizedPath, type Locale } from "@/lib/i18n/config";

export function InnerPageHero({ locale, title, eyebrow, homeLabel }: {
  locale: Locale;
  title: string;
  eyebrow: string;
  homeLabel: string;
}) {
  return <section className="inner-hero">
    <div className="inner-hero-glow"/>
    <div className="site-container inner-hero-content">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <nav className="breadcrumbs" aria-label={locale === "ar" ? "مسار الصفحة" : "Breadcrumb"}>
        <a href={localizedPath(locale)}>{homeLabel}</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
      </nav>
    </div>
  </section>;
}
