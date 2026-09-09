import type { PermissionKey, Principal } from "@/features/auth/permissions";
import { hasPermission } from "@/features/auth/permissions";

export type DashboardModule = {
  slug: string; labelAr: string; labelEn: string; permissions: readonly PermissionKey[]; icon: string;
};

export const dashboardModules: readonly DashboardModule[] = [
  { slug: "", labelAr: "نظرة عامة", labelEn: "Overview", permissions: ["dashboard.access"], icon: "grid" },
  { slug: "clients", labelAr: "العملاء", labelEn: "Clients", permissions: ["clients.read"], icon: "users" },
  { slug: "services", labelAr: "الخدمات", labelEn: "Services", permissions: ["services.read"], icon: "layers" },
  { slug: "projects", labelAr: "المشاريع", labelEn: "Projects", permissions: ["projects.read"], icon: "briefcase" },
  { slug: "pages", labelAr: "الصفحات", labelEn: "Pages", permissions: ["pages.read"], icon: "file" },
  { slug: "content", labelAr: "المحتوى", labelEn: "Content", permissions: ["blog.read", "pages.read", "faqs.read", "testimonials.read"], icon: "file" },
  { slug: "leads", labelAr: "طلبات التواصل", labelEn: "Leads", permissions: ["leads.read.all", "leads.read.assigned"], icon: "inbox" },
  { slug: "media", labelAr: "الوسائط", labelEn: "Media", permissions: ["media.read"], icon: "image" },
  { slug: "analytics", labelAr: "الإحصائيات", labelEn: "Analytics", permissions: ["analytics.read.aggregate"], icon: "chart" },
  { slug: "seo", labelAr: "تحسين الظهور", labelEn: "SEO", permissions: ["seo.read"], icon: "search" },
  { slug: "users", labelAr: "الموظفون", labelEn: "Team", permissions: ["users.manage"], icon: "user" },
  { slug: "roles", labelAr: "الأدوار والصلاحيات", labelEn: "Roles & permissions", permissions: ["roles.manage"], icon: "shield" },
  { slug: "settings", labelAr: "الإعدادات العامة", labelEn: "General settings", permissions: ["settings.manage"], icon: "settings" },
  { slug: "audit", labelAr: "سجل العمليات", labelEn: "Audit log", permissions: ["audit.read"], icon: "history" },
];

export function canOpenModule(principal: Principal, module: DashboardModule) {
  return module.permissions.some(permission => hasPermission(principal, permission));
}
