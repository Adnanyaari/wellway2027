import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme/switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getMessages } from "@/lib/i18n/messages";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getBrandLogos } from "@/features/site-settings/public";
import { SiteFooter } from "@/components/site-footer";
import { getPrincipal } from "@/features/auth/session";
import { hasPermission } from "@/features/auth/permissions";

const paths = ["", "/services", "/projects", "/about", "/blog", "/contact"];

export async function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const messages = getMessages(locale);
  const [logos, principal] = await Promise.all([getBrandLogos(), getPrincipal()]);
  const canOpenDashboard = hasPermission(principal, "dashboard.access");
  const accountHref = localizedPath(locale, canOpenDashboard ? "/dashboard" : "/auth/login");
  const accountLabel = canOpenDashboard ? (locale === "ar" ? "لوحة التحكم" : "Dashboard") : messages.loginLabel;
  const accountInitial = principal?.name.slice(0, 1).toUpperCase() ?? "";
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
          <a className="button button-primary header-cta" href={localizedPath(locale, "/contact")}>{messages.home.startProject}</a>
          <ThemeSwitcher labels={messages} />
          <LocaleSwitcher locale={locale} label={messages.language}/>
          <a className={`icon-button login-button${canOpenDashboard ? " authenticated-account" : ""}`} href={accountHref}
            aria-label={accountLabel} title={accountLabel}>
            {canOpenDashboard
              ? <span aria-hidden="true">{accountInitial}</span>
              : <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>}
          </a>
        </div>
        <details className="mobile-menu">
          <summary aria-label={messages.home.openMenu}><span/><span/><span/></summary>
          <nav aria-label={messages.home.mainNavigation}>
            {messages.home.navigation.map((item, index) => <a key={item} href={localizedPath(locale, paths[index] ?? "")}>{item}</a>)}
            <a href={accountHref}>{accountLabel}</a>
          </nav>
        </details>
      </div>
    </header>
    <main id="main-content">{children}</main>
    <SiteFooter locale={locale}/>
  </div>;
}
