"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

type Labels = {
  email: string; password: string; submit: string; submitting: string;
  error: string; showPassword: string; hidePassword: string;
  orContinueWith: string; google: string; apple: string; providerUnavailable: string;
};

export function LoginForm({ locale, labels }: { locale: Locale; labels: Labels }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") || "").trim().toLowerCase(),
          password: String(form.get("password") || ""),
          rememberMe: false,
        }),
      });
      if (!response.ok) throw new Error("invalid credentials");
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(labels.error);
      setPending(false);
    }
  }

  return <form className="auth-form" onSubmit={submit} noValidate>
    <label htmlFor="login-email">{labels.email}</label>
    <div className="auth-input-wrap">
      <MailIcon />
      <input id="login-email" name="email" type="email" inputMode="email" autoComplete="username"
        required maxLength={191} dir="ltr" disabled={pending} />
    </div>
    <label htmlFor="login-password">{labels.password}</label>
    <div className="auth-input-wrap">
      <LockIcon />
      <input id="login-password" name="password" type={showPassword ? "text" : "password"}
        autoComplete="current-password" required maxLength={128} dir="ltr" disabled={pending} />
      <button className="auth-password-toggle" type="button" disabled={pending}
        aria-label={showPassword ? labels.hidePassword : labels.showPassword}
        onClick={() => setShowPassword(value => !value)}><EyeIcon crossed={showPassword}/></button>
    </div>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="auth-submit" type="submit" disabled={pending}>
      {pending ? labels.submitting : labels.submit}<ArrowIcon />
    </button>
    <div className="auth-divider"><span>{labels.orContinueWith}</span></div>
    <div className="auth-provider-grid" aria-label={labels.orContinueWith}>
      <button className="auth-provider" type="button" disabled aria-label={`${labels.google} — ${labels.providerUnavailable}`}>
        <GoogleIcon/><span>{labels.google}</span><small>{labels.providerUnavailable}</small>
      </button>
      <button className="auth-provider" type="button" disabled aria-label={`${labels.apple} — ${labels.providerUnavailable}`}>
        <AppleIcon/><span>{labels.apple}</span><small>{labels.providerUnavailable}</small>
      </button>
    </div>
  </form>;
}

function MailIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m5 8 7 5 7-5"/></svg>; }
function LockIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>; }
function EyeIcon({ crossed }: { crossed: boolean }) { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/>{crossed && <path d="m4 4 16 16"/>}</svg>; }
function ArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>; }
function GoogleIcon() { return <svg className="provider-google" aria-hidden="true" viewBox="0 0 24 24"><path d="M21.35 12.2c0-.7-.06-1.22-.2-1.76H12v3.47h5.37a4.6 4.6 0 0 1-2 2.94l-.03.12 2.9 2.24.2.02c1.86-1.71 2.91-4.24 2.91-7.03Z"/><path d="M12 21.7c2.66 0 4.9-.87 6.53-2.38l-3.16-2.45c-.85.58-1.98.98-3.37.98a5.85 5.85 0 0 1-5.53-4.04l-.12.01-3.02 2.34-.04.11A9.86 9.86 0 0 0 12 21.7Z"/><path d="M6.47 13.81A6.08 6.08 0 0 1 6.15 12c0-.63.11-1.24.31-1.81v-.13L3.4 7.68l-.1.05A9.75 9.75 0 0 0 2.25 12c0 1.54.37 3 1.04 4.27l3.18-2.46Z"/><path d="M12 6.15c1.85 0 3.1.8 3.82 1.46l2.77-2.7A9.36 9.36 0 0 0 12 2.3a9.86 9.86 0 0 0-8.71 5.43l3.17 2.46A5.87 5.87 0 0 1 12 6.15Z"/></svg>; }
function AppleIcon() { return <svg className="provider-apple" aria-hidden="true" viewBox="0 0 24 24"><path d="M17.05 12.54c-.03-2.68 2.19-3.98 2.29-4.04a4.91 4.91 0 0 0-3.86-2.09c-1.62-.17-3.2.97-4.02.97-.84 0-2.1-.95-3.47-.92a5.12 5.12 0 0 0-4.31 2.63c-1.87 3.24-.48 8 1.32 10.62.9 1.29 1.94 2.73 3.31 2.68 1.34-.06 1.84-.86 3.45-.86 1.6 0 2.07.86 3.47.83 1.44-.02 2.35-1.29 3.21-2.59a10.6 10.6 0 0 0 1.47-3 4.61 4.61 0 0 1-2.86-4.23ZM14.42 4.7A4.7 4.7 0 0 0 15.5 1.3a4.8 4.8 0 0 0-3.12 1.62 4.45 4.45 0 0 0-1.11 3.27 3.95 3.95 0 0 0 3.15-1.49Z"/></svg>; }
