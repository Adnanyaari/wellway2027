import { notFound, redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { getPrincipal } from "@/features/auth/session";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = privateMetadata;
export default async function ChangePasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await getPrincipal();
  if (!principal) redirect(localizedPath(locale, "/auth/login"));
  if (!principal.mustChangePassword) redirect(localizedPath(locale, "/dashboard"));
  const messages = getMessages(locale);
  return <Shell locale={locale}><section className="auth-page">
    <div className="auth-card">
      <p className="auth-eyebrow">{messages.auth.eyebrow}</p>
      <h1>{messages.auth.changeTitle}</h1>
      <p className="auth-description">{messages.auth.changeDescription}</p>
      <ChangePasswordForm locale={locale} labels={{
        currentPassword: messages.auth.currentPassword,
        newPassword: messages.auth.newPassword,
        confirmPassword: messages.auth.confirmPassword,
        submit: messages.auth.changeSubmit,
        submitting: messages.auth.changing,
        error: messages.auth.changeError,
        requirement: messages.auth.requirement,
      }}/>
    </div>
  </section></Shell>;
}
