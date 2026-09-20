"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLead, type LeadFormState } from "@/features/leads/actions";
import type { Locale } from "@/lib/i18n/config";

const countries = [
  { code: "SA", flag: "🇸🇦", dial: "+966", ar: "السعودية", en: "Saudi Arabia" },
  { code: "AE", flag: "🇦🇪", dial: "+971", ar: "الإمارات", en: "UAE" },
  { code: "KW", flag: "🇰🇼", dial: "+965", ar: "الكويت", en: "Kuwait" },
  { code: "QA", flag: "🇶🇦", dial: "+974", ar: "قطر", en: "Qatar" },
  { code: "BH", flag: "🇧🇭", dial: "+973", ar: "البحرين", en: "Bahrain" },
  { code: "OM", flag: "🇴🇲", dial: "+968", ar: "عُمان", en: "Oman" },
] as const;

const initialLeadFormState: LeadFormState = { status: "idle" };

export function LeadForm({ locale, sourcePath = "/contact", serviceId, services = [] }: { locale: Locale; sourcePath?: string; serviceId?: string; services?: { id: string; title: string }[] }) {
  const ar = locale === "ar";
  const formRef = useRef<HTMLFormElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(submitLead, initialLeadFormState);
  useEffect(() => { if (sourceRef.current) sourceRef.current.value = `${window.location.pathname}${window.location.search}`; }, []);
  useEffect(() => { if (state.status === "success") formRef.current?.reset(); }, [state.status]);
  const invalid = (name: string) => Boolean(state.fields?.[name]?.length);
  const error = (name: string, arMessage: string, enMessage: string) => invalid(name) ? <p id={`${name}-error`} className="lead-field-error" role="alert">{ar ? arMessage : enMessage}</p> : null;
  return <form ref={formRef} action={action} className="lead-form" noValidate>
    <input type="hidden" name="locale" value={locale}/><input ref={sourceRef} type="hidden" name="sourcePath" defaultValue={sourcePath}/>
    {serviceId && <input type="hidden" name="requestedServiceId" value={serviceId}/>}<label className="lead-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <div className="lead-form-grid">
      <label><span>{ar ? "الاسم" : "Name"}</span><input key={`name-${state.values?.name ?? ""}`} name="name" defaultValue={state.values?.name ?? ""} required minLength={2} maxLength={191} autoComplete="name" placeholder={ar ? "كيف نناديك؟" : "How should we address you?"} aria-invalid={invalid("name")} aria-describedby={invalid("name") ? "name-error" : undefined}/>{error("name", "اكتب اسمًا صحيحًا من حرفين على الأقل.", "Enter a valid name with at least two characters.")}</label>
      <label><span>{ar ? "البريد الإلكتروني" : "Email"}</span><input key={`email-${state.values?.email ?? ""}`} name="email" defaultValue={state.values?.email ?? ""} type="email" required maxLength={191} autoComplete="email" inputMode="email" placeholder="name@example.com" dir="ltr" aria-invalid={invalid("email")} aria-describedby={invalid("email") ? "email-error" : undefined}/>{error("email", "أدخل بريدًا إلكترونيًا صحيحًا.", "Enter a valid email address.")}</label>
      <label className="lead-phone-field"><span>{ar ? "رقم الجوال" : "Mobile number"}</span><div><select key={`country-${state.values?.country ?? "SA"}`} name="country" defaultValue={state.values?.country ?? "SA"} aria-label={ar ? "الدولة" : "Country"}>{countries.map(country => <option key={country.code} value={country.code}>{country.flag} {country.dial} {ar ? country.ar : country.en}</option>)}</select><input key={`phone-${state.values?.phone ?? ""}`} name="phone" defaultValue={state.values?.phone ?? ""} required inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="5XXXXXXXX" dir="ltr" aria-invalid={invalid("phone")} aria-describedby={invalid("phone") ? "phone-error" : undefined}/></div>{error("phone", "أدخل رقم جوال صحيحًا للدولة المختارة.", "Enter a valid mobile number for the selected country.")}</label>
      {!serviceId && services.length > 0 && <label><span>{ar ? "الخدمة المطلوبة" : "Requested service"}</span><select key={`service-${state.values?.requestedServiceId ?? ""}`} name="requestedServiceId" defaultValue={state.values?.requestedServiceId ?? ""}><option value="">{ar ? "اختر إن رغبت" : "Choose if applicable"}</option>{services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label>}
      <label className="lead-message-field"><span>{ar ? "كيف نستطيع مساعدتك؟" : "How can we help?"}</span><textarea key={`message-${state.values?.message ?? ""}`} name="message" defaultValue={state.values?.message ?? ""} required minLength={10} maxLength={3000} rows={5} placeholder={ar ? "اكتب لنا نبذة مختصرة عن احتياجك…" : "Tell us briefly what you need…"} aria-invalid={invalid("message")} aria-describedby={invalid("message") ? "message-error" : undefined}/>{error("message", "اكتب نبذة من 10 أحرف على الأقل.", "Write at least 10 characters.")}</label>
    </div>
    <label className="lead-consent"><input key={`consent-${state.values?.consent ?? ""}`} name="consent" type="checkbox" defaultChecked={state.values?.consent === "on"} required aria-invalid={invalid("consent")} aria-describedby={invalid("consent") ? "consent-error" : undefined}/><span>{ar ? "أوافق على استخدام بياناتي للتواصل معي بخصوص هذا الطلب." : "I agree to the use of my details to contact me about this request."}</span></label>
    {error("consent", "يجب الموافقة قبل إرسال الطلب.", "You must agree before sending the request.")}
    {state.message && (state.status === "success" || !state.fields) && <p className={`lead-form-status ${state.status}`} role="status" aria-live="polite">{state.message}</p>}
    <button className="button button-primary lead-submit" type="submit" disabled={pending}>{pending ? (ar ? "جارٍ الإرسال…" : "Sending…") : (ar ? "إرسال الطلب" : "Send request")}</button>
  </form>;
}
