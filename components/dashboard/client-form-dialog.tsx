"use client";

import { useId, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ClientForm } from "./client-form";

type LogoOption = { id: string; storageKey: string; purpose: string };
type Values = { id?: string; nameAr?: string; nameEn?: string; website?: string | null; lightLogoId?: string | null; darkLogoId?: string | null };

export function ClientFormDialog({ locale, logoOptions, values }: {
  locale: Locale;
  logoOptions: LogoOption[];
  values?: Values;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const ar = locale === "ar";
  const editing = Boolean(values?.id);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return <>
    <button className={editing ? "client-edit-trigger" : "dashboard-add-trigger"} type="button" onClick={openDialog}>
      {editing ? (ar ? "تعديل السجل" : "Edit record") : (ar ? "إضافة عميل" : "Add client")}
      {!editing && <span aria-hidden="true">+</span>}
    </button>
    <dialog ref={dialogRef} className="dashboard-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onClick={event => { if (event.target === event.currentTarget) closeDialog(); }}>
      <div className="dashboard-dialog-panel">
        <header className="dashboard-dialog-header">
          <div>
            <p>{editing ? (ar ? "تعديل السجل" : "Edit record") : (ar ? "سجل جديد" : "New record")}</p>
            <h2 id={titleId}>{editing ? (ar ? "تعديل بيانات العميل" : "Edit client details") : (ar ? "إضافة شركة أو عميل" : "Add a company or client")}</h2>
            <span id={descriptionId}>{editing
              ? (ar ? "حدّث البيانات والشعارات ثم احفظ التغييرات." : "Update the details and logos, then save the changes.")
              : (ar ? "تُحفظ الأسماء الجديدة كمسودة للمراجعة قبل النشر." : "New names are saved as drafts for review before publishing.")}</span>
          </div>
          <button className="dashboard-dialog-close" type="button" onClick={closeDialog} aria-label={ar ? "إغلاق النافذة" : "Close dialog"}>×</button>
        </header>
        <div className="dashboard-dialog-body">
          <ClientForm locale={locale} logoOptions={logoOptions} compact={editing} values={values} onSuccess={closeDialog}/>
        </div>
      </div>
    </dialog>
  </>;
}
