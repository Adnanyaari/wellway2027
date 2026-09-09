"use client";

import { useActionState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { createClient, updateClient, type ClientActionState } from "@/app/[locale]/dashboard/clients/actions";

const initialState: ClientActionState = { ok: false, message: "" };
type LogoOption = { id: string; storageKey: string; purpose: string };
type Values = { id?: string; nameAr?: string; nameEn?: string; website?: string | null; lightLogoId?: string | null; darkLogoId?: string | null };

export function ClientForm({ locale, values, logoOptions, compact = false }: { locale: Locale; values?: Values; logoOptions: LogoOption[]; compact?: boolean }) {
  const ar = locale === "ar";
  const [state, action, pending] = useActionState(values?.id ? updateClient : createClient, initialState);
  return <form action={action} className={compact ? "client-form compact" : "client-form"}>
    <input type="hidden" name="locale" value={locale}/>{values?.id && <input type="hidden" name="id" value={values.id}/>} 
    <div className="client-form-grid">
      <label><span>{ar ? "الاسم بالعربية" : "Arabic name"}</span><input name="nameAr" required minLength={2} maxLength={191} defaultValue={values?.nameAr} dir="rtl"/></label>
      <label><span>{ar ? "الاسم بالإنجليزية" : "English name"}</span><input name="nameEn" maxLength={191} defaultValue={values?.nameEn} dir="ltr"/></label>
      <label className="client-form-wide"><span>{ar ? "رابط الموقع" : "Website URL"}</span><input name="website" type="url" maxLength={2048} defaultValue={values?.website ?? ""} placeholder="https://" dir="ltr"/></label>
      <label><span>{ar ? "شعار الوضع الفاتح" : "Light-mode logo"}</span><select name="lightLogoId" defaultValue={values?.lightLogoId ?? ""}><option value="">{ar ? "بدون شعار" : "No logo"}</option>{logoOptions.map(media => <option key={media.id} value={media.id}>{media.storageKey}</option>)}</select></label>
      <label><span>{ar ? "شعار الوضع الداكن" : "Dark-mode logo"}</span><select name="darkLogoId" defaultValue={values?.darkLogoId ?? ""}><option value="">{ar ? "بدون شعار" : "No logo"}</option>{logoOptions.map(media => <option key={media.id} value={media.id}>{media.storageKey}</option>)}</select></label>
      <label><span>{ar ? "أو ارفع شعارًا فاتحًا جديدًا" : "Or upload a new light logo"}</span><input name="lightLogoFile" type="file" accept="image/png,image/jpeg,image/webp"/></label>
      <label><span>{ar ? "أو ارفع شعارًا داكنًا جديدًا" : "Or upload a new dark logo"}</span><input name="darkLogoFile" type="file" accept="image/png,image/jpeg,image/webp"/></label>
    </div>
    <p className="client-form-hint">{ar ? "اختر شعارين معتمدين من مكتبة الوسائط. يمكن استخدام الصورة نفسها للوضعين إذا كانت واضحة على الخلفيتين." : "Choose approved assets from the media library. The same image may be used for both themes when it remains legible."} <a href={localizedPath(locale, "/dashboard/media")}>{ar ? "استعرض مكتبة الوسائط" : "Open media library"}</a></p>
    {state.message && <p className={state.ok ? "client-form-success" : "client-form-error"} role="status">{state.ok ? (ar ? "تم الحفظ بنجاح." : "Saved successfully.") : (ar ? "تحقق من البيانات المدخلة." : "Check the entered information.")}</p>}
    <button className="dashboard-primary-action" type="submit" disabled={pending}>{pending ? (ar ? "جارٍ الحفظ…" : "Saving…") : values?.id ? (ar ? "حفظ التعديلات" : "Save changes") : (ar ? "إضافة العميل" : "Add client")}</button>
  </form>;
}
