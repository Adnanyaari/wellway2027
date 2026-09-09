import "server-only";
import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";

export async function getDashboardOverview(principal: Principal) {
  if (!hasPermission(principal, "analytics.read.aggregate")) return null;
  const db = getDb();
  const [clients, services, projects, leads, users, posts] = await Promise.all([
    db.client.count({ where: { status: "ACTIVE" } }), db.service.count({ where: { status: "ACTIVE" } }),
    db.project.count({ where: { status: "ACTIVE" } }), db.lead.count(),
    db.user.count({ where: { status: "ACTIVE" } }), db.post.count({ where: { status: "ACTIVE" } }),
  ]);
  return { clients, services, projects, leads, users, posts };
}
