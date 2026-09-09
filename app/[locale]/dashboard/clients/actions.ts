"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requirePermission } from "@/features/auth/guards";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { storeImage } from "@/features/media/storage";

export type ClientActionState = { ok: boolean; message: string };
const clientSchema = z.object({
  locale: z.string().refine(isLocale), id: z.string().max(36).optional(),
  nameAr: z.string().trim().min(2).max(191), nameEn: z.string().trim().max(191).optional(),
  website: z.union([z.literal(""), z.string().trim().url().max(2048)]),
  lightLogoId: z.string().trim().max(36).optional(), darkLogoId: z.string().trim().max(36).optional(),
});

async function logosAreSelectable(ids: string[]) {
  if (ids.length === 0) return true;
  const count = await getDb().media.count({ where: { id: { in: ids }, status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } } });
  return count === new Set(ids).size;
}

async function resolveLogoIds(principal: Awaited<ReturnType<typeof requirePermission>>, formData: FormData, selected: { light?: string; dark?: string }) {
  let light = selected.light || "";
  let dark = selected.dark || "";
  const lightFile = formData.get("lightLogoFile");
  const darkFile = formData.get("darkLogoFile");
  if (lightFile instanceof File && lightFile.size) light = (await storeImage(principal, lightFile, "client-logo-light")).id;
  if (darkFile instanceof File && darkFile.size) dark = (await storeImage(principal, darkFile, "client-logo-dark")).id;
  return { light, dark };
}

export async function createClient(_: ClientActionState, formData: FormData): Promise<ClientActionState> {
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "invalid" };
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("clients.create", locale);
  let resolved;
  try { resolved = await resolveLogoIds(principal, formData, { light: parsed.data.lightLogoId, dark: parsed.data.darkLogoId }); }
  catch { return { ok: false, message: "invalid-logo" }; }
  const logoIds = [resolved.light, resolved.dark].filter(Boolean);
  if (!await logosAreSelectable(logoIds)) return { ok: false, message: "invalid-logo" };
  const db = getDb();
  await db.$transaction(async tx => {
    const client = await tx.client.create({ data: {
      name: parsed.data.nameAr, website: parsed.data.website || null, status: "ACTIVE",
      lightLogoId: resolved.light || null, darkLogoId: resolved.dark || null,
      sourceReference: `DASHBOARD:${principal.id}`,
      translations: { create: [
        { locale: "ar", name: parsed.data.nameAr, status: "DRAFT", sourceReference: `DASHBOARD:${principal.id}` },
        ...(parsed.data.nameEn ? [{ locale: "en" as const, name: parsed.data.nameEn, status: "DRAFT" as const, sourceReference: `DASHBOARD:${principal.id}` }] : []),
      ] },
    }, select: { id: true } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "client.create", targetType: "client", targetId: client.id, outcome: "SUCCESS" } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/clients"));
  return { ok: true, message: "created" };
}

export async function updateClient(_: ClientActionState, formData: FormData): Promise<ClientActionState> {
  const parsed = clientSchema.required({ id: true }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "invalid" };
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("clients.update", locale);
  let resolved;
  try { resolved = await resolveLogoIds(principal, formData, { light: parsed.data.lightLogoId, dark: parsed.data.darkLogoId }); }
  catch { return { ok: false, message: "invalid-logo" }; }
  const logoIds = [resolved.light, resolved.dark].filter(Boolean);
  if (!await logosAreSelectable(logoIds)) return { ok: false, message: "invalid-logo" };
  const sourceReference = `DASHBOARD:${principal.id}`;
  const db = getDb();
  await db.$transaction(async tx => {
    const existing = await tx.client.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
    if (!existing) throw new Error("NOT_FOUND");
    await tx.client.update({ where: { id: existing.id }, data: { name: parsed.data.nameAr, website: parsed.data.website || null,
      lightLogoId: resolved.light || null, darkLogoId: resolved.dark || null,
      translations: { upsert: [
        { where: { clientId_locale: { clientId: existing.id, locale: "ar" } }, create: { locale: "ar", name: parsed.data.nameAr, status: "DRAFT", sourceReference }, update: { name: parsed.data.nameAr, status: "DRAFT", publishedAt: null, sourceReference } },
        ...(parsed.data.nameEn ? [{ where: { clientId_locale: { clientId: existing.id, locale: "en" as const } }, create: { locale: "en" as const, name: parsed.data.nameEn, status: "DRAFT" as const, sourceReference }, update: { name: parsed.data.nameEn, status: "DRAFT" as const, publishedAt: null, sourceReference } }] : []),
      ] },
    } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "client.update", targetType: "client", targetId: existing.id, outcome: "SUCCESS" } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/clients"));
  return { ok: true, message: "updated" };
}

export async function setClientArchived(formData: FormData) {
  const parsed = z.object({ locale: z.string().refine(isLocale), id: z.string().min(1).max(36), archived: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("clients.archive", locale);
  await getDb().$transaction(async tx => {
    await tx.client.update({ where: { id: parsed.data.id }, data: { status: parsed.data.archived === "true" ? "ARCHIVED" : "ACTIVE" } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: parsed.data.archived === "true" ? "client.archive" : "client.restore", targetType: "client", targetId: parsed.data.id, outcome: "SUCCESS" } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/clients"));
}

export async function setClientPublished(formData: FormData) {
  const parsed = z.object({ locale: z.string().refine(isLocale), id: z.string().min(1).max(36), contentLocale: z.enum(["ar", "en"]), published: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("clients.publish", locale);
  const publish = parsed.data.published === "true";
  await getDb().$transaction(async tx => {
    const translation = await tx.clientTranslation.findUnique({ where: { clientId_locale: { clientId: parsed.data.id, locale: parsed.data.contentLocale } }, select: { id: true } });
    if (!translation) throw new Error("NOT_FOUND");
    const now = new Date();
    await tx.clientTranslation.update({ where: { id: translation.id }, data: publish ? { status: "PUBLISHED", reviewedByReference: principal.id, reviewedAt: now, publishedAt: now } : { status: "DRAFT", publishedAt: null } });
    const publishedCount = publish ? 1 : await tx.clientTranslation.count({ where: { clientId: parsed.data.id, status: "PUBLISHED", id: { not: translation.id } } });
    await tx.client.update({ where: { id: parsed.data.id }, data: { approvedAt: publishedCount > 0 ? now : null } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: publish ? "client.publish" : "client.unpublish", targetType: "client", targetId: parsed.data.id, outcome: "SUCCESS" } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/clients"));
  revalidatePath(localizedPath(parsed.data.contentLocale, ""));
}
