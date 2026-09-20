"use client";

import { useActionState, useEffect } from "react";
import { createService, updateService, type ServiceActionState } from "@/app/[locale]/dashboard/services/actions";
import type { Locale } from "@/lib/i18n/config";

const initialState: ServiceActionState = { ok: false, message: "" };
export type ServiceMediaOption = { id: string; storageKey: string; purpose: string };
export type ServiceFormValues = { id?: string; imageId?: string } & Record<"titleAr" | "summaryAr" | "bodyAr" | "slugAr" | "seoTitleAr" | "seoDescriptionAr" | "titleEn" | "summaryEn" | "bodyEn" | "slugEn" | "seoTitleEn" | "seoDescriptionEn", string>;

function LocaleFields({ contentLocale, values, ar }: { contentLocale: "ar" | "en"; values?: Partial<ServiceFormValues>; ar: boolean }) {
  const suffix = contentLocale === "ar" ? "Ar" : "En";
  const value = (key: "title" | "summary" | "body" | "slug" | "seoTitle" | "seoDescription") => values?.[`${key}${suffix}`] ?? "";
  return <section className="service-locale-fields" dir={contentLocale === "ar" ? "rtl" : "ltr"}>
    <header><strong>{contentLocale === "ar" ? (ar ? "المحتوى العربي" : "Arabic content") : (ar ? "المحتوى الإنجليزي" : "English content")}</strong><span>{ar ? "يحفظ كمسودة" : "Saved as draft"}</span></header>
    <label><span>{ar ? "اسم الخدمة" : "Service title"}</span><input name={`title${suffix}`} required minLength={2} maxLength={191} defaultValue={value("title")}/></label>
    <label><span>{ar ? "الرابط المختصر" : "URL slug"}</span><input name={`slug${suffix}`} required minLength={2} maxLength={191} pattern="[a-z0-9]+(-[a-z0-9]+)*" dir="ltr" defaultValue={value("slug")} placeholder="service-name"/></label>
    <label><span>{ar ? "الوصف المختصر" : "Short summary"}</span><textarea name={`summary${suffix}`} maxLength={1000} defaultValue={value("summary")}/></label>
    <label><span>{ar ? "تفاصيل الخدمة" : "Service details"}</span><textarea className="service-body-field" name={`body${suffix}`} maxLength={20000} defaultValue={value("body")}/></label>
    <label><span>{ar ? "عنوان SEO" : "SEO title"}</span><input name={`seoTitle${suffix}`} maxLength={191} defaultValue={value("seoTitle")}/></label>
    <label><span>{ar ? "وصف SEO" : "SEO description"}</span><textarea name={`seoDescription${suffix}`} maxLength={500} defaultValue={value("seoDescription")}/></label>
  </section>;
}

export function ServiceForm({ locale, values, mediaOptions, canUpload, onSuccess }: { locale: Locale; values?: ServiceFormValues; mediaOptions: ServiceMediaOption[]; canUpload: boolean; onSuccess?: () => void }) {
  const ar = locale === "ar";
  const [state, action, pending] = useActionState(values?.id ? updateService : createService, initialState);
  useEffect(() => { if (state.ok) onSuccess?.(); }, [state.ok, onSuccess]);
  return <form action={action} className="service-form">
    <input type="hidden" name="locale" value={locale}/>{values?.id && <input type="hidden" name="id" value={values.id}/>} 
    <section className="service-image-fields"><label><span>{ar ? "صورة الخدمة" : "Service image"}</span><select name="imageId" defaultValue={values?.imageId ?? ""}><option value="">{ar ? "بدون صورة" : "No image"}</option>{mediaOptions.map(media => <option key={media.id} value={media.id}>{media.storageKey}</option>)}</select></label>{canUpload && <label><span>{ar ? "أو ارفع صورة جديدة" : "Or upload a new image"}</span><input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp"/></label>}</section>
    <div className="service-form-locales"><LocaleFields contentLocale="ar" values={values} ar={ar}/><LocaleFields contentLocale="en" values={values} ar={ar}/></div>
    {state.message && <p className={state.ok ? "client-form-success" : "client-form-error"} role="status">{state.ok ? (ar ? "تم الحفظ كمسودة بنجاح." : "Saved as draft successfully.") : state.message === "duplicate-slug" ? (ar ? "الرابط المختصر مستخدم لخدمة أخرى." : "That URL slug is already used by another service.") : state.message === "invalid-image" ? (ar ? "صورة الخدمة غير صالحة أو غير متاحة." : "The service image is invalid or unavailable.") : (ar ? "تحقق من جميع الحقول والروابط المختصرة." : "Check all fields and URL slugs.")}</p>}
    <button className="dashboard-primary-action" type="submit" disabled={pending}>{pending ? (ar ? "جارٍ الحفظ…" : "Saving…") : values?.id ? (ar ? "حفظ التعديلات كمسودة" : "Save changes as draft") : (ar ? "إضافة الخدمة كمسودة" : "Add service as draft")}</button>
  </form>;
}
