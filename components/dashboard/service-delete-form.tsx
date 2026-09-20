"use client";

import { deleteService } from "@/app/[locale]/dashboard/services/actions";
import type { Locale } from "@/lib/i18n/config";

export function ServiceDeleteForm({ locale, id, disabled }: { locale: Locale; id: string; disabled: boolean }) {
  const ar = locale === "ar";
  return <form action={deleteService} onSubmit={event => {
    if (disabled || !window.confirm(ar ? "هل تريد حذف هذه الخدمة نهائيًا؟ لا يمكن التراجع عن الحذف." : "Permanently delete this service? This cannot be undone.")) event.preventDefault();
  }}><input type="hidden" name="locale" value={locale}/><input type="hidden" name="id" value={id}/><button className="service-delete-button" type="submit" disabled={disabled} title={disabled ? (ar ? "لا يمكن حذف خدمة مرتبطة بمشاريع أو طلبات" : "A service linked to projects or leads cannot be deleted") : undefined}>{disabled ? (ar ? "الخدمة مرتبطة ولا يمكن حذفها" : "Service is in use") : (ar ? "حذف الخدمة نهائيًا" : "Delete service permanently")}</button></form>;
}
