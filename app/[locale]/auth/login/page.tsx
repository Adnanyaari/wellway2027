import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { privateMetadata } from "@/lib/seo/metadata";
import { LoginForm } from "@/components/auth/login-form";
import { getPrincipal } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { localizedPath } from "@/lib/i18n/config";
import Image from "next/image";
import { getBrandLogos } from "@/features/site-settings/public";

export const metadata = privateMetadata;
export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await getPrincipal();
  if (principal) redirect(localizedPath(locale, principal.mustChangePassword ? "/auth/change-password" : "/dashboard"));
  const messages = getMessages(locale);
  const logos = await getBrandLogos();
  return <Shell locale={locale}><section className="auth-page">
    <div className="auth-glow" aria-hidden="true"/>
    <div className="auth-frame">
      <div className="auth-form-panel">
        <div className="auth-form-content">
          <div className="auth-card-brand" aria-hidden="true"><span>W</span></div>
          <p className="auth-eyebrow">{messages.auth.eyebrow}</p>
          <h1>{messages.authTitle}</h1>
          <p className="auth-description">{messages.auth.description}</p>
          <LoginForm locale={locale} labels={messages.auth}/>
        </div>
      </div>
      <aside className="auth-brand-panel">
        <div className="auth-brand-grid" aria-hidden="true"/>
        <Image className="auth-brand-logo" src={logos.dark.path} width={220} height={90} alt="WELL WAY" priority/>
        <div className="auth-orbit auth-orbit-one" aria-hidden="true"/><div className="auth-orbit auth-orbit-two" aria-hidden="true"/>
        <div className="auth-brand-copy">
          <p>WELL WAY 2027</p>
          <h2>{messages.auth.visualTitle}</h2>
          <span>{messages.auth.visualDescription}</span>
        </div>
        <div className="auth-visual-card auth-visual-card-main" aria-hidden="true"><i/><i/><i/><b/></div>
        <div className="auth-visual-card auth-visual-card-small" aria-hidden="true"><span>W</span><i/><i/></div>
      </aside>
    </div>
  </section></Shell>;
}
