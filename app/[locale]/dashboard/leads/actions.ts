"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/features/auth/guards";
import { leadStatuses, updateLead } from "@/features/leads/admin";
import { hasPermission } from "@/features/auth/permissions";
import { isLocale, localizedPath } from "@/lib/i18n/config";

const schema = z.object({ locale: z.string().refine(isLocale), id: z.string().min(1).max(36), status: z.enum(leadStatuses), assignedUserId: z.string().max(36), note: z.string().trim().max(3000), version: z.coerce.number().int().nonnegative() });

export async function saveLead(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const principal = await requirePermission("dashboard.access", parsed.data.locale);
  if (!hasPermission(principal, "leads.update.all") && !hasPermission(principal, "leads.update.assigned")) return;
  await updateLead(principal, { id: parsed.data.id, status: parsed.data.status, assignedUserId: parsed.data.assignedUserId || null, note: parsed.data.note || null, version: parsed.data.version });
  revalidatePath(localizedPath(parsed.data.locale, "/dashboard/leads"));
}
