"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

type Labels = {
  currentPassword: string; newPassword: string; confirmPassword: string;
  submit: string; submitting: string; error: string; requirement: string;
};

export function ChangePasswordForm({ locale, labels }: { locale: Locale; labels: Labels }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body = {
      currentPassword: String(form.get("currentPassword") || ""),
      newPassword: String(form.get("newPassword") || ""),
      confirmPassword: String(form.get("confirmPassword") || ""),
    };
    try {
      const response = await fetch("/api/account/change-initial-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("password change failed");
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(labels.error);
      setPending(false);
    }
  }
  return <form className="auth-form" onSubmit={submit}>
    <PasswordField name="currentPassword" label={labels.currentPassword} autoComplete="current-password" pending={pending}/>
    <PasswordField name="newPassword" label={labels.newPassword} autoComplete="new-password" pending={pending}/>
    <p className="auth-help">{labels.requirement}</p>
    <PasswordField name="confirmPassword" label={labels.confirmPassword} autoComplete="new-password" pending={pending}/>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="auth-submit" type="submit" disabled={pending}>{pending ? labels.submitting : labels.submit}</button>
  </form>;
}

function PasswordField({ name, label, autoComplete, pending }: { name: string; label: string; autoComplete: string; pending: boolean }) {
  return <><label htmlFor={name}>{label}</label><div className="auth-input-wrap"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input id={name} name={name} type="password" autoComplete={autoComplete} minLength={name === "currentPassword" ? 1 : 6} maxLength={128} required dir="ltr" disabled={pending}/></div></>;
}
