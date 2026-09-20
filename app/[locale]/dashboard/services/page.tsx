import { notFound } from "next/navigation";
import Image from "next/image";
import { ServiceFormDialog, type ServiceFormValues } from "@/components/dashboard/service-form-dialog";
import { ServiceDeleteForm } from "@/components/dashboard/service-delete-form";
import { requirePermission } from "@/features/auth/guards";
import { hasPermission } from "@/features/auth/permissions";
import { listServiceMedia, listServices } from "@/features/services/admin";
import { mediaPreviewPath } from "@/features/media/admin";
import { isLocale } from "@/lib/i18n/config";
import { setServiceArchived, setServicePublished } from "./actions";

export default async function ServicesDashboardPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await requirePermission("services.read", locale);
  const { q = "" } = await searchParams;
  const [services, mediaOptions] = await Promise.all([listServices(principal, q), listServiceMedia(principal)]);
  const ar = locale === "ar";
  const canUpload = hasPermission(principal, "media.upload");
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "إدارة المحتوى" : "Content management"}</p><h1>{ar ? "الخدمات" : "Services"}</h1><span>{ar ? `${services.length} خدمة ظاهرة من قاعدة البيانات` : `${services.length} services shown from the database`}</span></div>{hasPermission(principal, "services.create") && <ServiceFormDialog locale={locale} mediaOptions={mediaOptions} canUpload={canUpload}/>}</section>
    <section className="client-toolbar"><form><input name="q" defaultValue={q} maxLength={100} placeholder={ar ? "ابحث بالاسم أو الرابط…" : "Search by title or slug…"}/><button type="submit">{ar ? "بحث" : "Search"}</button></form><div><span>{ar ? "نشط" : "Active"}: <b>{services.filter(item => item.status === "ACTIVE").length}</b></span><span>{ar ? "مؤرشف" : "Archived"}: <b>{services.filter(item => item.status === "ARCHIVED").length}</b></span></div></section>
    <section className="client-list" aria-label={ar ? "قائمة الخدمات" : "Service list"}>
      {services.length === 0 ? <div className="dashboard-module-empty"><span>خ</span><h2>{ar ? "لا توجد نتائج" : "No results"}</h2><p>{ar ? "غيّر البحث أو أضف أول خدمة." : "Change the search query or add the first service."}</p></div> : services.map(service => {
        const arabic = service.translations.find(item => item.locale === "ar");
        const english = service.translations.find(item => item.locale === "en");
        const values: ServiceFormValues = { id: service.id, imageId: service.imageId ?? "", titleAr: arabic?.title ?? "", summaryAr: arabic?.summary ?? "", bodyAr: arabic?.body ?? "", slugAr: arabic?.slug ?? "", seoTitleAr: arabic?.seoTitle ?? "", seoDescriptionAr: arabic?.seoDescription ?? "", titleEn: english?.title ?? "", summaryEn: english?.summary ?? "", bodyEn: english?.body ?? "", slugEn: english?.slug ?? "", seoTitleEn: english?.seoTitle ?? "", seoDescriptionEn: english?.seoDescription ?? "" };
        return <details className="client-accordion" key={service.id}>
          <summary className="client-row"><div className="client-avatar">{(arabic?.title ?? english?.title ?? "خ").slice(0, 1)}</div><div className="client-identity"><h2>{arabic?.title ?? english?.title ?? "—"}</h2><p dir="ltr">/{english?.slug ?? arabic?.slug ?? "—"}</p></div><div className="client-meta"><span className={service.status === "ACTIVE" ? "status-active" : "status-archived"}>{service.status === "ACTIVE" ? (ar ? "نشط" : "Active") : (ar ? "مؤرشف" : "Archived")}</span><small>{ar ? `${service._count.projects} مشاريع` : `${service._count.projects} projects`}</small></div><span className="client-accordion-toggle" aria-hidden="true">⌄</span></summary>
          <div className="client-accordion-body">
            {service.image && <div className="service-dashboard-image"><Image src={mediaPreviewPath(service.image.id, service.image.storageKey) ?? ""} alt="" width={560} height={260} unoptimized/></div>}
            <div className="client-detail-grid"><div><span>{ar ? "العربية" : "Arabic"}</span><b>{arabic?.status === "PUBLISHED" ? (ar ? "منشور" : "Published") : (ar ? "مسودة" : "Draft")}</b></div><div><span>{ar ? "الإنجليزية" : "English"}</span><b>{english?.status === "PUBLISHED" ? (ar ? "منشور" : "Published") : (ar ? "مسودة" : "Draft")}</b></div><div><span>{ar ? "العملاء المحتملون" : "Leads"}</span><b>{service._count.leads}</b></div><div><span>{ar ? "آخر تحديث" : "Last updated"}</span><b>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(service.updatedAt)}</b></div></div>
            {hasPermission(principal, "services.update") && <div className="client-settings"><h3>{ar ? "الصورة والمحتوى وإعدادات SEO" : "Image, content & SEO settings"}</h3><ServiceFormDialog locale={locale} values={values} mediaOptions={mediaOptions} canUpload={canUpload}/></div>}
            {hasPermission(principal, "services.publish") && <div className="client-publication"><h3>{ar ? "النشر في الموقع" : "Website publication"}</h3>{service.translations.map(translation => <form action={setServicePublished} key={translation.locale}><input type="hidden" name="locale" value={locale}/><input type="hidden" name="id" value={service.id}/><input type="hidden" name="contentLocale" value={translation.locale}/><input type="hidden" name="published" value={translation.status === "PUBLISHED" ? "false" : "true"}/><span>{translation.locale === "ar" ? (ar ? "العربية" : "Arabic") : (ar ? "الإنجليزية" : "English")}</span><b>{translation.status === "PUBLISHED" ? (ar ? "منشور" : "Published") : (ar ? "مسودة" : "Draft")}</b><button type="submit">{translation.status === "PUBLISHED" ? (ar ? "إلغاء النشر" : "Unpublish") : (ar ? "نشر" : "Publish")}</button></form>)}</div>}
            {(hasPermission(principal, "services.archive") || hasPermission(principal, "services.delete")) && <div className="client-actions">{hasPermission(principal, "services.archive") && <form action={setServiceArchived}><input type="hidden" name="locale" value={locale}/><input type="hidden" name="id" value={service.id}/><input type="hidden" name="archived" value={service.status === "ACTIVE" ? "true" : "false"}/><button type="submit">{service.status === "ACTIVE" ? (ar ? "أرشفة الخدمة" : "Archive service") : (ar ? "استعادة الخدمة" : "Restore service")}</button></form>}{hasPermission(principal, "services.delete") && <ServiceDeleteForm locale={locale} id={service.id} disabled={service._count.projects > 0 || service._count.leads > 0}/>}</div>}
          </div>
        </details>;
      })}
    </section>
  </>;
}
