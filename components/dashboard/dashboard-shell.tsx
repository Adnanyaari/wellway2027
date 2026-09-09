import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme/switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { DashboardNav } from "./dashboard-nav";
import { dashboardModules, canOpenModule } from "@/features/dashboard/navigation";
import { getBrandLogos } from "@/features/site-settings/public";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Principal } from "@/features/auth/permissions";
import { AccountMenu } from "./account-menu";

export async function DashboardShell({ locale, principal, children }: { locale: Locale; principal: Principal; children: React.ReactNode }) {
  const ar = locale === "ar";
  const logos = await getBrandLogos();
  const items = dashboardModules.filter(module => canOpenModule(principal, module)).map(module => ({
    href: localizedPath(locale, `/dashboard${module.slug ? `/${module.slug}` : ""}`),
    label: ar ? module.labelAr : module.labelEn, icon: module.icon,
  }));
  return <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <a className="dashboard-logo" href={localizedPath(locale, "/dashboard")}><Image src={logos.light.path} width={150} height={58} alt="WELL WAY"/></a>
      <p className="dashboard-nav-label">{ar ? "القائمة" : "Menu"}</p>
      <DashboardNav items={items} label={ar ? "تنقل لوحة التحكم" : "Dashboard navigation"}/>
    </aside>
    <div className="dashboard-workspace">
      <header className="dashboard-toolbar">
        <details className="dashboard-mobile-menu"><summary aria-label={ar ? "فتح القائمة" : "Open menu"}><span/><span/><span/></summary><div><DashboardNav items={items} label={ar ? "تنقل لوحة التحكم" : "Dashboard navigation"}/></div></details>
        <div className="dashboard-search"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg><span>{ar ? "بحث سريع" : "Quick search"}</span><kbd>⌘ K</kbd></div>
        <div className="dashboard-toolbar-actions">
          <LocaleSwitcher locale={locale} label={ar ? "اللغة" : "Language"}/>
          <ThemeSwitcher labels={{ theme: ar ? "المظهر" : "Appearance", light: ar ? "فاتح" : "Light", dark: ar ? "داكن" : "Dark", system: ar ? "النظام" : "System" }}/>
          <a className="dashboard-visit-site" href={localizedPath(locale)}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg><span>{ar ? "زيارة الموقع" : "Visit site"}</span></a>
          <AccountMenu locale={locale} name={principal.name} email={principal.email}/>
        </div>
      </header>
      <main className="dashboard-main">{children}</main>
    </div>
  </div>;
}
