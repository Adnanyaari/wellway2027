"use client";

import { useId, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ServiceForm, type ServiceFormValues, type ServiceMediaOption } from "./service-form";
export type { ServiceFormValues, ServiceMediaOption } from "./service-form";

export function ServiceFormDialog({ locale, values, mediaOptions, canUpload }: { locale: Locale; values?: ServiceFormValues; mediaOptions: ServiceMediaOption[]; canUpload: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const ar = locale === "ar";
  const editing = Boolean(values?.id);
  const close = () => dialogRef.current?.close();
  return <>
    <button className={editing ? "client-edit-trigger" : "dashboard-add-trigger"} type="button" onClick={() => dialogRef.current?.showModal()}>{editing ? (ar ? "تعديل الخدمة" : "Edit service") : (ar ? "إضافة خدمة" : "Add service")}{!editing && <span aria-hidden="true">+</span>}</button>
    <dialog ref={dialogRef} className="dashboard-dialog service-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="dashboard-dialog-panel"><header className="dashboard-dialog-header"><div><p>{editing ? (ar ? "تعديل السجل" : "Edit record") : (ar ? "خدمة جديدة" : "New service")}</p><h2 id={titleId}>{editing ? (ar ? "تعديل بيانات الخدمة" : "Edit service details") : (ar ? "إضافة خدمة" : "Add a service")}</h2><span id={descriptionId}>{ar ? "حرر الصورة والنسختين العربية والإنجليزية، ثم انشر كل لغة بشكل مستقل." : "Edit the image, Arabic, and English, then publish each locale independently."}</span></div><button className="dashboard-dialog-close" type="button" onClick={close} aria-label={ar ? "إغلاق النافذة" : "Close dialog"}>×</button></header><div className="dashboard-dialog-body"><ServiceForm locale={locale} values={values} mediaOptions={mediaOptions} canUpload={canUpload} onSuccess={close}/></div></div>
    </dialog>
  </>;
}
