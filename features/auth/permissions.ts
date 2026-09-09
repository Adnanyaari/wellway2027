import "server-only";

export const initialRoleNames = ["ADMIN", "SEO", "ADS", "CUSTOMER_SERVICE"] as const;
export const permissionKeys = [
  "dashboard.access", "analytics.read.aggregate", "users.manage", "roles.manage", "audit.read",
  "seo.read", "seo.update", "redirects.manage", "media.read", "media.upload", "media.delete",
  "leads.read.assigned", "leads.read.all", "leads.update.assigned", "leads.update.all",
  "leads.assign", "leads.export", "leads.delete",
] as const;
export type PermissionKey = typeof permissionKeys[number];
export type Principal = {
  id: string;
  name: string;
  email: string;
  mustChangePassword: boolean;
  permissions: readonly string[];
};

export function hasPermission(principal: Principal | null, key: PermissionKey): boolean {
  return principal !== null && permissionKeys.includes(key) && principal.permissions.includes(key);
}
export function canAccessLead(principal: Principal | null, action: "read" | "update", assignedUserId: string | null) {
  return hasPermission(principal, `leads.${action}.all`) ||
    (principal !== null && principal.id === assignedUserId && hasPermission(principal, `leads.${action}.assigned`));
}
