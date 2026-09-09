import Image from "next/image";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getBrandLogos, getCompanyContact } from "@/features/site-settings/public";

const navigationPaths = ["", "/services", "/projects", "/about", "/blog", "/contact"];
const socialLabels = { instagram: "Instagram", x: "X", linkedin: "LinkedIn", snapchat: "Snapchat", tiktok: "TikTok", youtube: "YouTube" } as const;
const socialMarks = { instagram: "IG", x: "X", linkedin: "in", snapchat: "SC", tiktok: "TT", youtube: "YT" } as const;

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [logos, contact] = await Promise.all([getBrandLogos(), getCompanyContact()]);
  const messages = getMessages(locale);
  const address = contact.address[locale];
  const socialLinks: Array<{ platform: string; href: string; label: string; mark: string }> = Object.entries(contact.social)
    .filter((entry): entry is [keyof typeof socialLabels, string] => Boolean(entry[1]))
    .map(([platform, href]) => ({ platform, href, label: socialLabels[platform], mark: socialMarks[platform] }));
  if (contact.whatsapp) socialLinks.push({ platform: "whatsapp", href: contact.whatsapp, label: "WhatsApp", mark: "WA" });
  const phoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

  return <footer className="site-footer">
    <div className="site-container footer-main">
      <div className="footer-brand">
        <a href={localizedPath(locale)} aria-label={messages.home.homeLabel}>
          <Image src={logos.dark.path} width={190} height={76} alt="WELL WAY"/>
        </a>
        <p>{locale === "ar" ? "شركة ويل واي للتسويق" : "WELL WAY Marketing Company"}</p>
        {socialLinks.length > 0 && <nav className="footer-social" aria-label={locale === "ar" ? "حسابات التواصل الاجتماعي" : "Social media"}>
          {socialLinks.map(({ platform, href, label: socialLabel, mark }) => <a key={platform} href={href} target="_blank" rel="noreferrer noopener" aria-label={socialLabel}>
            {mark}
          </a>)}
        </nav>}
      </div>

      <div className="footer-column">
        <h2>{locale === "ar" ? "روابط سريعة" : "Quick links"}</h2>
        <nav>{messages.home.navigation.map((label, index) => <a key={label} href={localizedPath(locale, navigationPaths[index] ?? "")}>{label}</a>)}</nav>
      </div>

      <div className="footer-column footer-contact">
        <h2>{locale === "ar" ? "تواصل معنا" : "Contact us"}</h2>
        {contact.primaryPhone && <a href={phoneHref(contact.primaryPhone)} dir="ltr">{contact.primaryPhone}</a>}
        {contact.unifiedPhone && <a href={phoneHref(contact.unifiedPhone)} dir="ltr">{contact.unifiedPhone}</a>}
        {contact.businessEmail && <a href={`mailto:${contact.businessEmail}`} dir="ltr">{contact.businessEmail}</a>}
        {address && <address>{address}</address>}
      </div>
    </div>
    <div className="site-container footer-bottom">
      <p>© {new Date().getUTCFullYear()} WELL WAY</p>
      <nav>
        <a href={localizedPath(locale, "/privacy")}>{messages.pages.privacy.title}</a>
        <a href={localizedPath(locale, "/terms")}>{messages.pages.terms.title}</a>
      </nav>
    </div>
  </footer>;
}
