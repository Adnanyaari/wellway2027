import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme/switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getMessages } from "@/lib/i18n/messages";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getBrandLogos } from "@/features/site-settings/public";
import { SiteFooter } from "@/components/site-footer";

const paths = ["", "/services", "/projects", "/about", "/blog", "/contact"];

export async function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const messages = getMessages(locale);
  const logos = await getBrandLogos();
  return <div className="site-shell">
    <a className="skip-link" href="#main-content">{messages.home.skipToContent}</a>
    <header className="site-header">
      <div className="site-container header-inner">
        <a className="brand-link" href={localizedPath(locale)} aria-label={messages.home.homeLabel}>
          <Image src={logos.dark.path} width={180} height={72} priority alt="WELL WAY" />
        </a>
        <nav className="desktop-nav" aria-label={messages.home.mainNavigation}>
          {messages.home.navigation.map((item, index) => <a key={item} href={localizedPath(locale, paths[index] ?? "")}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <LocaleSwitcher locale={locale} label={messages.language}/>
          <ThemeSwitcher labels={messages} />
          <a className="button button-primary header-cta" href={localizedPath(locale, "/contact")}>{messages.home.startProject}</a>
        </div>
        <details className="mobile-menu">
          <summary aria-label={messages.home.openMenu}><span/><span/><span/></summary>
          <nav aria-label={messages.home.mainNavigation}>
            {messages.home.navigation.map((item, index) => <a key={item} href={localizedPath(locale, paths[index] ?? "")}>{item}</a>)}
          </nav>
        </details>
      </div>
    </header>
    <main id="main-content">{children}</main>
    <SiteFooter locale={locale}/>
  </div>;
}
