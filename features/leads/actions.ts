"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { getDb } from "@/db/client";
import { isLocale } from "@/lib/i18n/config";

const gulfCountries = {
  SA: { dial: "+966", min: 9, max: 9 }, AE: { dial: "+971", min: 9, max: 9 },
  KW: { dial: "+965", min: 8, max: 8 }, QA: { dial: "+974", min: 8, max: 8 },
  BH: { dial: "+973", min: 8, max: 8 }, OM: { dial: "+968", min: 8, max: 8 },
} as const;

const leadSchema = z.object({
  locale: z.string().refine(isLocale),
  name: z.string().trim().min(2).max(191),
  email: z.string().trim().toLowerCase().email().max(191),
  country: z.enum(["SA", "AE", "KW", "QA", "BH", "OM"]),
  phone: z.string().trim().regex(/^\d{8,10}$/),
  message: z.string().trim().min(10).max(3000),
  requestedServiceId: z.string().trim().max(36).optional(),
  sourcePath: z.string().trim().max(2048).optional(),
  consent: z.literal("on"),
  website: z.string().max(0),
});

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string; fields?: Record<string, string[]>; values?: Record<string, string> };

function safeSource(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value, "https://wellway.invalid");
    const allowed = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const item = url.searchParams.get(key);
      if (item) allowed.set(key, item.slice(0, 255));
    }
    return `${url.pathname}${allowed.size ? `?${allowed}` : ""}`.slice(0, 2048);
  } catch { return null; }
}

export async function submitLead(_: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData);
  const values = Object.fromEntries(["name", "email", "country", "phone", "message", "requestedServiceId", "consent"].map(key => [key, typeof raw[key] === "string" ? raw[key] : ""]));
  const parsed = leadSchema.safeParse(raw);
  const ar = formData.get("locale") !== "en";
  if (!parsed.success) return { status: "error", message: ar ? "تحقق من البيانات المطلوبة ثم حاول مرة أخرى." : "Check the required fields and try again.", fields: parsed.error.flatten().fieldErrors, values };
  const country = gulfCountries[parsed.data.country];
  const localDigits = parsed.data.phone.replace(/^0+/, "");
  if (localDigits.length < country.min || localDigits.length > country.max) return { status: "error", message: ar ? "رقم الجوال غير صحيح للدولة المختارة." : "The mobile number is invalid for the selected country.", fields: { phone: ["INVALID"] }, values };
  const phone = `${country.dial}${localDigits}`;
  const sourceUrl = safeSource(parsed.data.sourcePath);
  const source = sourceUrl ? new URL(sourceUrl, "https://wellway.invalid") : null;
  const requestedServiceId = parsed.data.requestedServiceId || null;
  if (requestedServiceId) {
    const service = await getDb().service.findFirst({ where: { id: requestedServiceId, status: "ACTIVE", translations: { some: { locale: parsed.data.locale, status: "PUBLISHED" } } }, select: { id: true } });
    if (!service) return { status: "error", message: ar ? "الخدمة المختارة غير متاحة حاليًا." : "The selected service is currently unavailable.", values };
  }
  const requestHeaders = await headers();
  const referrer = safeSource(requestHeaders.get("referer") ?? undefined);
  const bucket = Math.floor(Date.now() / 300000);
  const idempotencyKey = createHash("sha256").update(`${parsed.data.email}|${phone}|${parsed.data.message}|${bucket}`).digest("hex");
  try {
    await getDb().$transaction(async tx => {
      const lead = await tx.lead.create({ data: {
        name: parsed.data.name, email: parsed.data.email, phone, message: parsed.data.message,
        locale: parsed.data.locale, sourceUrl, referrer,
        utmSource: source?.searchParams.get("utm_source")?.slice(0, 255) ?? null,
        utmMedium: source?.searchParams.get("utm_medium")?.slice(0, 255) ?? null,
        utmCampaign: source?.searchParams.get("utm_campaign")?.slice(0, 255) ?? null,
        utmTerm: source?.searchParams.get("utm_term")?.slice(0, 255) ?? null,
        utmContent: source?.searchParams.get("utm_content")?.slice(0, 255) ?? null,
        requestedServiceId, idempotencyKey,
        consentEvidence: { accepted: true, capturedAt: new Date().toISOString(), policy: "contact-form" },
      } });
      await tx.leadActivity.create({ data: { leadId: lead.id, type: "CREATED", changes: { sourceUrl, locale: parsed.data.locale } } });
      await tx.notificationOutbox.create({ data: { leadId: lead.id, deduplicationKey: `lead-created:${lead.id}` } });
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { status: "success", message: ar ? "تم استلام طلبك مسبقًا وسنتواصل معك قريبًا." : "We already received your request and will contact you soon." };
    return { status: "error", message: ar ? "تعذر إرسال الطلب الآن. حاول مرة أخرى بعد قليل." : "The request could not be sent. Please try again shortly.", values };
  }
  return { status: "success", message: ar ? "وصلنا طلبك بنجاح، وسيتواصل معك فريقنا قريبًا." : "Your request was received. Our team will contact you soon." };
}
