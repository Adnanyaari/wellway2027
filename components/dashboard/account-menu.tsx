"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { authClient } from "@/lib/auth/client";
import { DashboardIcon } from "./dashboard-nav";

export function AccountMenu({ locale, name, email }: { locale: Locale; name: string; email: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const ar = locale === "ar";
  return <div className="dashboard-account-menu">
    <button className="dashboard-account-trigger" type="button" aria-haspopup="menu" aria-label={ar ? "عرض حساب المستخدم" : "Show user account"}>
      <span className="dashboard-user-avatar">{name.slice(0, 1).toUpperCase()}</span>
      <span className="dashboard-user-copy"><b>{name}</b><small dir="ltr">{email}</small></span>
      <svg className="dashboard-user-chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m8 10 4 4 4-4"/></svg>
    </button>
    <div className="dashboard-account-popover" role="menu">
      <div className="dashboard-account-heading">
        <span className="dashboard-user-avatar">{name.slice(0, 1).toUpperCase()}</span>
        <div><small>{ar ? "الحساب الحالي" : "Signed-in account"}</small><strong>{name}</strong><span dir="ltr">{email}</span></div>
      </div>
      {error && <p className="dashboard-signout-error" role="alert">{ar ? "تعذر تسجيل الخروج. حاول مرة أخرى." : "Could not sign out. Please try again."}</p>}
      <button type="button" role="menuitem" disabled={pending} onClick={async () => {
        setPending(true);
        setError(false);
        const result = await authClient.signOut();
        if (result.error) {
          setError(true);
          setPending(false);
          return;
        }
        window.location.replace(`/${locale}/auth/login`);
      }}><DashboardIcon name="logout"/><span>{pending ? (ar ? "جارٍ تسجيل الخروج…" : "Signing out…") : (ar ? "تسجيل الخروج" : "Sign out")}</span></button>
    </div>
  </div>;
}
