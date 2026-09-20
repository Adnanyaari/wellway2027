import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { hasPermission } from "@/features/auth/permissions";
import { leadStatuses, listAssignableUsers, listLeads } from "@/features/leads/admin";
import { isLocale } from "@/lib/i18n/config";
import { saveLead } from "./actions";

const statusLabels: Record<string, { ar: string; en: string }> = { NEW: { ar: "جديد", en: "New" }, IN_PROGRESS: { ar: "قيد المتابعة", en: "In progress" }, QUALIFIED: { ar: "مؤهل", en: "Qualified" }, WON: { ar: "مكتمل", en: "Won" }, LOST: { ar: "مغلق", en: "Lost" }, SPAM: { ar: "مزعج", en: "Spam" } };

export default async function LeadsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; status?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await requirePermission("dashboard.access", locale);
  if (!hasPermission(principal, "leads.read.all") && !hasPermission(principal, "leads.read.assigned")) notFound();
  const { q = "", status = "" } = await searchParams;
  const [leads, users] = await Promise.all([listLeads(principal, q, status), listAssignableUsers(principal)]);
  const ar = locale === "ar";
  const canUpdate = hasPermission(principal, "leads.update.all") || hasPermission(principal, "leads.update.assigned");
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "إدارة علاقات العملاء" : "Customer relationships"}</p><h1>{ar ? "طلبات التواصل" : "Contact requests"}</h1><span>{ar ? `${leads.length} طلب ظاهر وفق عوامل التصفية الحالية` : `${leads.length} requests match the current filters`}</span></div></section>
    <section className="client-toolbar"><form><input name="q" defaultValue={q} maxLength={100} placeholder={ar ? "ابحث بالاسم أو الجوال أو البريد…" : "Search name, mobile, or email…"}/><select name="status" defaultValue={status}><option value="">{ar ? "كل الحالات" : "All statuses"}</option>{leadStatuses.map(item => <option key={item} value={item}>{statusLabels[item]?.[locale] ?? item}</option>)}</select><button>{ar ? "تصفية" : "Filter"}</button></form><div><span>{ar ? "جديد" : "New"}: <b>{leads.filter(item => item.status === "NEW").length}</b></span></div></section>
    <section className="lead-admin-list">{leads.length === 0 ? <div className="dashboard-module-empty"><span>ط</span><h2>{ar ? "لا توجد طلبات" : "No requests"}</h2><p>{ar ? "ستظهر طلبات التواصل الحقيقية هنا عند وصولها." : "Real contact requests will appear here when received."}</p></div> : leads.map(lead => <details className="lead-admin-card" key={lead.id}>
      <summary><span className={`lead-status status-${lead.status.toLowerCase()}`}>{statusLabels[lead.status]?.[locale] ?? lead.status}</span><div><h2>{lead.name}</h2><p><span dir="ltr">{lead.phone ?? "—"}</span> · <span dir="ltr">{lead.email ?? "—"}</span></p></div><time>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(lead.createdAt)}</time><b aria-hidden="true">⌄</b></summary>
      <div className="lead-admin-body"><div className="lead-admin-message"><span>{ar ? "الرسالة" : "Message"}</span><p>{lead.message}</p></div><dl><div><dt>{ar ? "المصدر" : "Source"}</dt><dd dir="ltr">{lead.sourceUrl ?? "—"}</dd></div><div><dt>{ar ? "الخدمة" : "Service"}</dt><dd>{lead.requestedService?.translations.find(item => item.locale === locale)?.title ?? "—"}</dd></div><div><dt>{ar ? "المسؤول" : "Assigned to"}</dt><dd>{lead.assignedUser?.name ?? (ar ? "غير معين" : "Unassigned")}</dd></div><div><dt>{ar ? "إشعار البريد" : "Email notification"}</dt><dd>{lead.notifications[0]?.status ?? "PENDING"}</dd></div></dl>
        {canUpdate && <form action={saveLead} className="lead-admin-form"><input type="hidden" name="locale" value={locale}/><input type="hidden" name="id" value={lead.id}/><input type="hidden" name="version" value={lead.version}/><label><span>{ar ? "الحالة" : "Status"}</span><select name="status" defaultValue={lead.status}>{leadStatuses.map(item => <option key={item} value={item}>{statusLabels[item]?.[locale] ?? item}</option>)}</select></label><label><span>{ar ? "المسؤول" : "Assignee"}</span><select name="assignedUserId" defaultValue={lead.assignedUserId ?? ""} disabled={!hasPermission(principal, "leads.assign")}><option value="">{ar ? "غير معين" : "Unassigned"}</option>{users.map(user => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select>{!hasPermission(principal, "leads.assign") && <input type="hidden" name="assignedUserId" value={lead.assignedUserId ?? ""}/>}</label><label className="lead-admin-note"><span>{ar ? "ملاحظة داخلية" : "Internal note"}</span><textarea name="note" maxLength={3000} rows={3}/></label><button className="dashboard-primary-action">{ar ? "حفظ التحديث" : "Save update"}</button></form>}
        {lead.activities.length > 0 && <div className="lead-timeline"><h3>{ar ? "سجل الطلب" : "Request history"}</h3>{lead.activities.map(activity => <div key={activity.id}><time>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(activity.createdAt)}</time><b>{activity.type}</b>{activity.note && <p>{activity.note}</p>}</div>)}</div>}
      </div></details>)}</section>
  </>;
}
