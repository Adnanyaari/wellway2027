import { notFound } from "next/navigation";
import { InnerPageHero } from "@/components/layout/inner-page-hero";
import { LeadForm } from "@/components/leads/lead-form";
import { Shell } from "@/components/shell";
import { getPublishedServices } from "@/features/services/public";
import { getCompanyContact } from "@/features/site-settings/public";
import { getRuntimeMessages } from "@/features/settings/ui-messages";
import { getSiteConfig } from "@/lib/env";
import { isLocale } from "@/lib/i18n/config";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getRuntimeMessages(locale);
  return localeMetadata(getSiteConfig().origin, locale, messages.pages.contact.title, "/contact");
}

const contactIcon = (name: "phone" | "mail" | "chat" | "mobile" | "pin") => {
  const paths = { phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z", mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7", chat: "M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.8-.8L3 21l1.7-5a8.4 8.4 0 1 1 16.3-4.5Z", mobile: "M7 2h10v20H7V2Zm4 17h2", pin: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" };
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={paths[name]}/></svg>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, contact, services] = await Promise.all([getRuntimeMessages(locale), getCompanyContact(), getPublishedServices(locale)]);
  const labels = messages.contactPage;
  const phone = contact.primaryPhone?.replace(/[^+\d]/g, "") ?? null;
  const whatsapp = contact.whatsapp ?? (phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null);
  const address = contact.address[locale];
  const mapHref = contact.mapUrl ?? (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null);
  const workingHours = contact.workingHours[locale];
  const actions = [
    phone && { icon: "phone" as const, label: labels.call, value: labels.callAction, href: `tel:${phone}` },
    contact.businessEmail && { icon: "mail" as const, label: labels.email, value: contact.businessEmail, href: `mailto:${contact.businessEmail}` },
    whatsapp && { icon: "chat" as const, label: labels.whatsapp, value: labels.whatsappAction, href: whatsapp },
    contact.primaryPhone && { icon: "mobile" as const, label: labels.mobile, value: contact.primaryPhone, href: `tel:${phone}` },
    mapHref && { icon: "pin" as const, label: labels.visit, value: address ?? labels.openMap, href: mapHref },
  ].filter(Boolean) as { icon: "phone" | "mail" | "chat" | "mobile" | "pin"; label: string; value: string; href: string }[];
  const social = Object.entries(contact.social).filter((item): item is [string, string] => Boolean(item[1]));
  return <Shell locale={locale}>
    <InnerPageHero locale={locale} title={messages.pages.contact.title} eyebrow="WELL WAY" homeLabel={messages.services.home}/>
    <main className="contact-page">
      <section className="contact-quick" aria-label={labels.quickTitle}><div className="site-container contact-quick-grid">{actions.map(action => <a key={`${action.label}-${action.href}`} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noreferrer" : undefined}><span>{contactIcon(action.icon)}</span><small>{action.label}</small><b dir={action.icon === "mobile" || action.icon === "mail" ? "ltr" : undefined}>{action.value}</b></a>)}</div></section>
      <section className="contact-main"><div className="site-container contact-main-grid">
        <div className="contact-invitation"><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.title}</h2><p className="contact-lead">{labels.description}</p>
          <div className="contact-hours"><span>{labels.hours}</span><p className={workingHours ? "" : "contact-setting-pending"}>{workingHours ?? labels.hoursPending}</p></div>
          <div className="contact-social"><span>{labels.follow}</span>{social.length > 0 ? <div>{social.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name}</a>)}</div> : <p className="contact-setting-pending">{labels.socialPending}</p>}</div>
        </div>
        <div className="contact-form-panel"><div><span>01</span><h2>{labels.formTitle}</h2><p>{labels.formDescription}</p></div><LeadForm locale={locale} sourcePath={`/${locale}/contact`} services={services.map(service => ({ id: service.service.id, title: service.title }))}/></div>
      </div></section>
    </main>
  </Shell>;
}
