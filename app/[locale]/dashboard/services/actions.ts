"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requirePermission } from "@/features/auth/guards";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { storeImage } from "@/features/media/storage";

export type ServiceActionState = { ok: boolean; message: string };
const slugSchema = z.string().trim().min(2).max(191).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const serviceSchema = z.object({
  locale: z.string().refine(isLocale), id: z.string().max(36).optional(),
  imageId: z.string().trim().max(36).optional(),
  titleAr: z.string().trim().min(2).max(191), summaryAr: z.string().trim().max(1000), bodyAr: z.string().trim().max(20000), slugAr: slugSchema,
  seoTitleAr: z.string().trim().max(191), seoDescriptionAr: z.string().trim().max(500),
  titleEn: z.string().trim().min(2).max(191), summaryEn: z.string().trim().max(1000), bodyEn: z.string().trim().max(20000), slugEn: slugSchema,
  seoTitleEn: z.string().trim().max(191), seoDescriptionEn: z.string().trim().max(500),
});

function translationData(input: z.infer<typeof serviceSchema>, contentLocale: "ar" | "en", sourceReference: string) {
  const suffix = contentLocale === "ar" ? "Ar" : "En";
  return {
    locale: contentLocale,
    title: input[`title${suffix}`], summary: input[`summary${suffix}`] || null, body: input[`body${suffix}`] || null,
    slug: input[`slug${suffix}`], seoTitle: input[`seoTitle${suffix}`] || null, seoDescription: input[`seoDescription${suffix}`] || null,
    status: "DRAFT" as const, publishedAt: null, reviewedAt: null, reviewedByReference: null, sourceReference,
  };
}

async function saveService(permission: "services.create" | "services.update", formData: FormData): Promise<ServiceActionState> {
  const parsed = (permission === "services.update" ? serviceSchema.required({ id: true }) : serviceSchema).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "invalid" };
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission(permission, locale);
  const sourceReference = `DASHBOARD:${principal.id}`;
  let imageId = parsed.data.imageId || "";
  const imageFile = formData.get("imageFile");
  try {
    if (imageFile instanceof File && imageFile.size) imageId = (await storeImage(principal, imageFile, "service-image")).id;
  } catch { return { ok: false, message: "invalid-image" }; }
  if (imageId && await getDb().media.count({ where: { id: imageId, status: "ACTIVE", isPublic: true, mimeType: { startsWith: "image/" } } }) !== 1) return { ok: false, message: "invalid-image" };
  try {
    await getDb().$transaction(async tx => {
      if (permission === "services.create") {
        const service = await tx.service.create({ data: { status: "ACTIVE", imageId: imageId || null }, select: { id: true } });
        await tx.serviceTranslation.createMany({ data: [translationData(parsed.data, "ar", sourceReference), translationData(parsed.data, "en", sourceReference)].map(item => ({ ...item, serviceId: service.id })) });
        await tx.auditLog.create({ data: { actorId: principal.id, action: "service.create", targetType: "service", targetId: service.id, outcome: "SUCCESS" } });
      } else {
        const id = parsed.data.id;
        if (!id) throw new Error("INVALID_ID");
        const existing = await tx.service.findUnique({ where: { id }, select: { id: true } });
        if (!existing) throw new Error("NOT_FOUND");
        await tx.service.update({ where: { id }, data: { imageId: imageId || null } });
        for (const contentLocale of ["ar", "en"] as const) {
          const data = translationData(parsed.data, contentLocale, sourceReference);
          await tx.serviceTranslation.upsert({ where: { serviceId_locale: { serviceId: id, locale: contentLocale } }, create: { ...data, serviceId: id }, update: data });
        }
        await tx.auditLog.create({ data: { actorId: principal.id, action: "service.update", targetType: "service", targetId: id, outcome: "SUCCESS" } });
      }
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unique constraint") || error.message.includes("P2002"))) return { ok: false, message: "duplicate-slug" };
    throw error;
  }
  revalidatePath(localizedPath(locale, "/dashboard/services"));
  return { ok: true, message: permission === "services.create" ? "created" : "updated" };
}

export async function createService(_: ServiceActionState, formData: FormData) { return saveService("services.create", formData); }
export async function updateService(_: ServiceActionState, formData: FormData) { return saveService("services.update", formData); }

export async function setServiceArchived(formData: FormData) {
  const parsed = z.object({ locale: z.string().refine(isLocale), id: z.string().min(1).max(36), archived: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("services.archive", locale);
  const archived = parsed.data.archived === "true";
  await getDb().$transaction(async tx => {
    await tx.service.update({ where: { id: parsed.data.id }, data: { status: archived ? "ARCHIVED" : "ACTIVE" } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: archived ? "service.archive" : "service.restore", targetType: "service", targetId: parsed.data.id, outcome: "SUCCESS" } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/services"));
  revalidatePath("/", "layout");
}

export async function setServicePublished(formData: FormData) {
  const parsed = z.object({ locale: z.string().refine(isLocale), id: z.string().min(1).max(36), contentLocale: z.enum(["ar", "en"]), published: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("services.publish", locale);
  const publish = parsed.data.published === "true";
  await getDb().$transaction(async tx => {
    const translation = await tx.serviceTranslation.findUnique({ where: { serviceId_locale: { serviceId: parsed.data.id, locale: parsed.data.contentLocale } }, select: { id: true } });
    if (!translation) throw new Error("NOT_FOUND");
    const now = new Date();
    await tx.serviceTranslation.update({ where: { id: translation.id }, data: publish ? { status: "PUBLISHED", reviewedByReference: principal.id, reviewedAt: now, publishedAt: now } : { status: "DRAFT", publishedAt: null } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: publish ? "service.publish" : "service.unpublish", targetType: "serviceTranslation", targetId: translation.id, outcome: "SUCCESS", metadata: { locale: parsed.data.contentLocale } } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/services"));
  revalidatePath(localizedPath(parsed.data.contentLocale, "/services"));
  revalidatePath(localizedPath(parsed.data.contentLocale, ""));
}

export async function deleteService(formData: FormData) {
  const parsed = z.object({ locale: z.string().refine(isLocale), id: z.string().min(1).max(36) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const locale = parsed.data.locale as Locale;
  const principal = await requirePermission("services.delete", locale);
  await getDb().$transaction(async tx => {
    const service = await tx.service.findUnique({ where: { id: parsed.data.id }, select: { id: true, _count: { select: { projects: true, leads: true } } } });
    if (!service) throw new Error("NOT_FOUND");
    if (service._count.projects > 0 || service._count.leads > 0) throw new Error("SERVICE_IN_USE");
    await tx.serviceTranslation.deleteMany({ where: { serviceId: service.id } });
    await tx.service.delete({ where: { id: service.id } });
    await tx.auditLog.create({ data: { actorId: principal.id, action: "service.delete", targetType: "service", targetId: service.id, outcome: "SUCCESS" } });
  });
  revalidatePath(localizedPath(locale, "/dashboard/services"));
  revalidatePath("/", "layout");
}
