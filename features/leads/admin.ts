import "server-only";
import { getDb } from "@/db/client";
import { canAccessLead, hasPermission, type Principal } from "@/features/auth/permissions";

export const leadStatuses = ["NEW", "IN_PROGRESS", "QUALIFIED", "WON", "LOST", "SPAM"] as const;

export async function countNewLeads(principal: Principal) {
  if (!hasPermission(principal, "leads.read.all") && !hasPermission(principal, "leads.read.assigned")) return null;
  return getDb().lead.count({ where: { status: "NEW", ...(hasPermission(principal, "leads.read.all") ? {} : { assignedUserId: principal.id }) } });
}

export async function listLeads(principal: Principal, query: string, status: string) {
  if (!hasPermission(principal, "leads.read.all") && !hasPermission(principal, "leads.read.assigned")) throw new Error("FORBIDDEN");
  const search = query.trim().slice(0, 100);
  const validStatus = leadStatuses.includes(status as typeof leadStatuses[number]) ? status : undefined;
  return getDb().lead.findMany({
    where: {
      ...(hasPermission(principal, "leads.read.all") ? {} : { assignedUserId: principal.id }),
      ...(validStatus ? { status: validStatus } : {}),
      ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }, { message: { contains: search } }] } : {}),
    },
    orderBy: { createdAt: "desc" }, take: 100,
    select: { id: true, name: true, email: true, phone: true, message: true, locale: true, sourceUrl: true, referrer: true, status: true, assignedUserId: true, followUpAt: true, version: true, createdAt: true, updatedAt: true,
      requestedService: { select: { translations: { where: { status: "PUBLISHED" }, select: { locale: true, title: true } } } },
      assignedUser: { select: { id: true, name: true, email: true } },
      activities: { orderBy: { createdAt: "desc" }, take: 8, select: { id: true, type: true, note: true, changes: true, createdAt: true, actor: { select: { name: true } } } },
      notifications: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true, attempts: true, lastError: true, sentAt: true } },
    },
  });
}

export async function listAssignableUsers(principal: Principal) {
  if (!hasPermission(principal, "leads.assign")) return [];
  return getDb().user.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" }, take: 100, select: { id: true, name: true, email: true } });
}

export async function updateLead(principal: Principal, input: { id: string; status: typeof leadStatuses[number]; assignedUserId: string | null; note: string | null; version: number }) {
  const current = await getDb().lead.findUnique({ where: { id: input.id }, select: { assignedUserId: true, status: true, version: true } });
  if (!current || !canAccessLead(principal, "update", current.assignedUserId)) throw new Error("FORBIDDEN");
  if (input.assignedUserId !== current.assignedUserId && !hasPermission(principal, "leads.assign")) throw new Error("FORBIDDEN");
  if (input.assignedUserId) {
    const user = await getDb().user.findFirst({ where: { id: input.assignedUserId, status: "ACTIVE" }, select: { id: true } });
    if (!user) throw new Error("INVALID_ASSIGNEE");
  }
  await getDb().$transaction(async tx => {
    const result = await tx.lead.updateMany({ where: { id: input.id, version: input.version }, data: { status: input.status, assignedUserId: input.assignedUserId, version: { increment: 1 } } });
    if (result.count !== 1) throw new Error("STALE_LEAD");
    await tx.leadActivity.create({ data: { leadId: input.id, actorId: principal.id, type: input.note ? "NOTE_AND_UPDATE" : "UPDATED", note: input.note, changes: { status: { from: current.status, to: input.status }, assignedUserId: { from: current.assignedUserId, to: input.assignedUserId } } } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "lead.update", targetType: "lead", targetId: input.id, outcome: "SUCCESS", metadata: { status: input.status, assignedUserId: input.assignedUserId } } });
  });
}
