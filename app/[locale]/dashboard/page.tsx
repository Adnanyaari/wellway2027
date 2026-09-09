import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { isLocale } from "@/lib/i18n/config";
import { getDashboardOverview } from "@/features/dashboard/overview";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Protect the page itself; future data services must independently enforce their own capabilities.
  const principal = await requirePermission("dashboard.access", locale);
  const overview = await getDashboardOverview(principal);
  const ar = locale === "ar";
  const cards = overview ? [
    [ar ? "العملاء" : "Clients", overview.clients], [ar ? "الخدمات" : "Services", overview.services],
    [ar ? "المشاريع" : "Projects", overview.projects], [ar ? "طلبات التواصل" : "Leads", overview.leads],
    [ar ? "الموظفون" : "Team", overview.users], [ar ? "المقالات" : "Posts", overview.posts],
  ] as const : [];
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "لوحة الإدارة" : "Administration"}</p><h1>{ar ? `مرحبًا، ${principal.name}` : `Welcome, ${principal.name}`}</h1><span>{ar ? "هذه نظرة مباشرة على بيانات النظام الحالية." : "Here is a live view of the current system data."}</span></div></section>
    {overview ? <section className="dashboard-stat-grid" aria-label={ar ? "ملخص البيانات" : "Data summary"}>{cards.map(([label, value], index) => <article className={index === 0 ? "dashboard-stat featured" : "dashboard-stat"} key={label}><div><span>{String(index + 1).padStart(2, "0")}</span><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg></div><strong>{new Intl.NumberFormat(locale).format(value)}</strong><p>{label}</p><small>{ar ? "بيانات فعلية" : "Live data"}</small></article>)}</section> : <div className="dashboard-empty">{ar ? "لا توجد صلاحية لعرض الإحصائيات." : "You do not have access to aggregate analytics."}</div>}
    <section className="dashboard-panels"><article><div className="dashboard-panel-heading"><div><p>{ar ? "الوصول السريع" : "Quick access"}</p><h2>{ar ? "إدارة العمل" : "Manage your work"}</h2></div></div><div className="dashboard-quick-grid"><a href={`/${locale}/dashboard/services`}>{ar ? "الخدمات" : "Services"}<span>↗</span></a><a href={`/${locale}/dashboard/projects`}>{ar ? "المشاريع" : "Projects"}<span>↗</span></a><a href={`/${locale}/dashboard/clients`}>{ar ? "العملاء" : "Clients"}<span>↗</span></a><a href={`/${locale}/dashboard/settings`}>{ar ? "الإعدادات" : "Settings"}<span>↗</span></a></div></article><article className="dashboard-status-panel"><p>{ar ? "حالة النظام" : "System status"}</p><h2>{ar ? "قاعدة البيانات متصلة" : "Database connected"}</h2><div><span/><b>{ar ? "البيانات محدثة الآن" : "Data is current"}</b></div></article></section>
  </>;
}
