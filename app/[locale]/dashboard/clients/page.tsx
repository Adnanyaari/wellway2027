import { notFound } from "next/navigation";
import { ClientForm } from "@/components/dashboard/client-form";
import { requirePermission } from "@/features/auth/guards";
import { hasPermission } from "@/features/auth/permissions";
import { listClientLogoMedia, listClients } from "@/features/clients/admin";
import { isLocale } from "@/lib/i18n/config";
import { setClientArchived, setClientPublished } from "./actions";

export default async function ClientsDashboardPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await requirePermission("clients.read", locale);
  const { q = "" } = await searchParams;
  const [clients, logoOptions] = await Promise.all([listClients(principal, q), listClientLogoMedia(principal)]);
  const ar = locale === "ar";
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "إدارة المحتوى" : "Content management"}</p><h1>{ar ? "الشركات والعملاء" : "Companies & clients"}</h1><span>{ar ? `${clients.length} سجلًا ظاهرًا من قاعدة البيانات` : `${clients.length} records shown from the database`}</span></div>{hasPermission(principal, "clients.create") && <a href="#add-client">{ar ? "إضافة عميل" : "Add client"}<span>+</span></a>}</section>
    <section className="client-toolbar"><form><input name="q" defaultValue={q} maxLength={100} placeholder={ar ? "ابحث بالاسم أو الموقع…" : "Search by name or website…"}/><button type="submit">{ar ? "بحث" : "Search"}</button></form><div><span>{ar ? "نشط" : "Active"}: <b>{clients.filter(client => client.status === "ACTIVE").length}</b></span><span>{ar ? "مؤرشف" : "Archived"}: <b>{clients.filter(client => client.status === "ARCHIVED").length}</b></span></div></section>
    <section className="client-list" aria-label={ar ? "قائمة العملاء" : "Client list"}>
      {clients.length === 0 ? <div className="dashboard-module-empty"><span>W</span><h2>{ar ? "لا توجد نتائج" : "No results"}</h2><p>{ar ? "غيّر عبارة البحث أو أضف أول عميل." : "Change the search query or add the first client."}</p></div> : clients.map(client => {
        const nameAr = client.translations.find(item => item.locale === "ar")?.name ?? client.name;
        const nameEn = client.translations.find(item => item.locale === "en")?.name ?? "";
        return <details className="client-accordion" key={client.id}>
          <summary className="client-row">
            <div className="client-avatar">{nameAr.slice(0, 1)}</div>
            <div className="client-identity"><h2>{nameAr}</h2><p dir="ltr">{nameEn || client.website || "—"}</p></div>
            <div className="client-meta"><span className={client.status === "ACTIVE" ? "status-active" : "status-archived"}>{client.status === "ACTIVE" ? (ar ? "نشط" : "Active") : (ar ? "مؤرشف" : "Archived")}</span><small>{ar ? `${client._count.projects} مشاريع` : `${client._count.projects} projects`}</small></div>
            <span className="client-accordion-toggle" aria-hidden="true">⌄</span>
          </summary>
          <div className="client-accordion-body">
            <div className="client-detail-grid">
              <div><span>{ar ? "الموقع" : "Website"}</span><b dir="ltr">{client.website || "—"}</b></div>
              <div><span>{ar ? "شعار الوضع الفاتح" : "Light-mode logo"}</span><b dir="ltr">{client.lightLogo?.storageKey || (ar ? "غير مضاف" : "Not assigned")}</b></div>
              <div><span>{ar ? "شعار الوضع الداكن" : "Dark-mode logo"}</span><b dir="ltr">{client.darkLogo?.storageKey || (ar ? "غير مضاف" : "Not assigned")}</b></div>
              <div><span>{ar ? "آخر تحديث" : "Last updated"}</span><b>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(client.updatedAt)}</b></div>
            </div>
            {hasPermission(principal, "clients.update") && <div className="client-settings"><h3>{ar ? "التفاصيل والإعدادات" : "Details & settings"}</h3><ClientForm locale={locale} logoOptions={logoOptions} compact values={{ id: client.id, nameAr, nameEn, website: client.website, lightLogoId: client.lightLogo?.id, darkLogoId: client.darkLogo?.id }}/></div>}
            {hasPermission(principal, "clients.publish") && <div className="client-publication"><h3>{ar ? "النشر في الموقع" : "Website publication"}</h3>{client.translations.map(translation => <form action={setClientPublished} key={translation.locale}><input type="hidden" name="locale" value={locale}/><input type="hidden" name="id" value={client.id}/><input type="hidden" name="contentLocale" value={translation.locale}/><input type="hidden" name="published" value={translation.status === "PUBLISHED" ? "false" : "true"}/><span>{translation.locale === "ar" ? (ar ? "العربية" : "Arabic") : (ar ? "الإنجليزية" : "English")}</span><b>{translation.status === "PUBLISHED" ? (ar ? "منشور" : "Published") : (ar ? "مسودة" : "Draft")}</b><button type="submit">{translation.status === "PUBLISHED" ? (ar ? "إلغاء النشر" : "Unpublish") : (ar ? "نشر" : "Publish")}</button></form>)}</div>}
            {hasPermission(principal, "clients.archive") && <div className="client-actions"><form action={setClientArchived}><input type="hidden" name="locale" value={locale}/><input type="hidden" name="id" value={client.id}/><input type="hidden" name="archived" value={client.status === "ACTIVE" ? "true" : "false"}/><button type="submit">{client.status === "ACTIVE" ? (ar ? "أرشفة العميل" : "Archive client") : (ar ? "استعادة العميل" : "Restore client")}</button></form></div>}
          </div>
        </details>;
      })}
    </section>
    {hasPermission(principal, "clients.create") && <section className="client-create-panel" id="add-client"><div><p>{ar ? "سجل جديد" : "New record"}</p><h2>{ar ? "إضافة شركة أو عميل" : "Add a company or client"}</h2><span>{ar ? "تُحفظ الأسماء الجديدة كمسودة للمراجعة قبل النشر. اختر شعاري الوضعين من مكتبة الوسائط." : "New names are saved as drafts for review before publishing. Choose both theme logos from the media library."}</span></div><ClientForm locale={locale} logoOptions={logoOptions}/></section>}
  </>;
}
