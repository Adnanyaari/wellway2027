import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { dashboardModules, canOpenModule } from "@/features/dashboard/navigation";
import { isLocale } from "@/lib/i18n/config";

export default async function DashboardModulePage({ params }: { params: Promise<{ locale: string; module: string }> }) {
  const { locale, module: slug } = await params;
  if (!isLocale(locale)) notFound();
  const definition = dashboardModules.find(item => item.slug === slug && item.slug !== "");
  if (!definition) notFound();
  const principal = await requirePermission("dashboard.access", locale);
  if (!canOpenModule(principal, definition)) notFound();
  const ar = locale === "ar";
  const label = ar ? definition.labelAr : definition.labelEn;
  return <><section className="dashboard-heading"><div><p>{ar ? "لوحة الإدارة" : "Administration"}</p><h1>{label}</h1><span>{ar ? "تم تجهيز مساحة الوحدة، وستُبنى وظائفها في مرحلتها المخصصة." : "The module workspace is ready; its operations will be built in its dedicated phase."}</span></div></section><section className="dashboard-module-empty"><span>{label.slice(0, 1)}</span><h2>{ar ? "مساحة جاهزة للعمل" : "Workspace ready"}</h2><p>{ar ? "لا توجد بيانات تجريبية أو إجراءات غير معتمدة في هذه الوحدة." : "This module contains no sample data or unapproved operations."}</p></section></>;
}
