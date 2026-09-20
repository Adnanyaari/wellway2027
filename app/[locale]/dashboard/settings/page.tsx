import Image from "next/image";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { hasPermission, type Principal } from "@/features/auth/permissions";
import { listBrandMedia } from "@/features/settings/brand-assets";
import { listUiMessages } from "@/features/settings/ui-messages";
import { getBrandAssets, getCompanyContact, type CompanyContact } from "@/features/site-settings/public";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { saveBrandAssets, saveContactSettings, saveUiMessage } from "./actions";
import { TermSearch } from "@/components/dashboard/term-search";

type BrandAssets = Awaited<ReturnType<typeof getBrandAssets>>;
type BrandMedia = Awaited<ReturnType<typeof listBrandMedia>>;

function AssetField({ ar, title, description, name, fileName, current, media, canUpload, optional = false }: {
  ar: boolean; title: string; description: string; name: string; fileName: string;
  current?: { mediaId: string; path: string }; media: BrandMedia; canUpload: boolean; optional?: boolean;
}) {
  return <article className="settings-asset-card">
    <div className="settings-asset-preview">
      {current ? <Image src={current.path} width={240} height={120} alt="" unoptimized/> : <span>{ar ? "لا توجد صورة" : "No image"}</span>}
    </div>
    <div className="settings-asset-copy"><h2>{title}</h2><p>{description}</p></div>
    <label><span>{ar ? "اختيار من مكتبة الوسائط" : "Choose from media library"}</span>
      <select name={name} defaultValue={current?.mediaId ?? ""} required={!optional}>
        {optional && <option value="">{ar ? "بدون أيقونة مستقلة" : "No separate icon"}</option>}
        {media.map(item => <option key={item.id} value={item.id}>{item.storageKey}</option>)}
      </select>
    </label>
    {canUpload && <label><span>{ar ? "أو ارفع صورة جديدة" : "Or upload a new image"}</span><input name={fileName} type="file" accept="image/png,image/jpeg,image/webp"/></label>}
  </article>;
}

function GeneralSettings({ locale, principal, assets, media }: { locale: Locale; principal: Principal; assets: BrandAssets; media: BrandMedia }) {
  const ar = locale === "ar";
  const canUpload = hasPermission(principal, "media.upload");
  return <form action={saveBrandAssets} className="settings-general-form">
    <input type="hidden" name="locale" value={locale}/>
    <div className="settings-section-heading"><div><h2>{ar ? "الهوية البصرية" : "Visual identity"}</h2><p>{ar ? "الشعارات العامة التي يستخدمها الموقع ولوحة التحكم في الوضعين الفاتح والداكن." : "Global assets used by the website and dashboard in light and dark modes."}</p></div></div>
    <div className="settings-assets-grid">
      <AssetField ar={ar} title={ar ? "الشعار الفاتح" : "Light-mode logo"} description={ar ? "يظهر فوق الخلفيات الفاتحة." : "Shown against light backgrounds."} name="lightLogoId" fileName="lightLogoFile" current={assets.light} media={media} canUpload={canUpload}/>
      <AssetField ar={ar} title={ar ? "الشعار الداكن" : "Dark-mode logo"} description={ar ? "يظهر فوق الخلفيات الداكنة." : "Shown against dark backgrounds."} name="darkLogoId" fileName="darkLogoFile" current={assets.dark} media={media} canUpload={canUpload}/>
      <AssetField ar={ar} title={ar ? "أيقونة الموقع (Favicon)" : "Site icon (Favicon)"} description={ar ? "تظهر في تبويب المتصفح ونتائج البحث. يفضل ملف PNG مربع." : "Shown in browser tabs and search results. A square PNG is recommended."} name="faviconId" fileName="faviconFile" current={assets.favicon} media={media} canUpload={canUpload} optional/>
    </div>
    <div className="settings-form-footer"><p>{ar ? "الحفظ يحدّث الهوية في الموقع مباشرة. الملفات المرفوعة تضاف تلقائيًا إلى مكتبة الوسائط." : "Saving updates the site identity immediately. Uploaded files are added to the media library."}</p><button className="dashboard-primary-action" type="submit">{ar ? "حفظ الإعدادات العامة" : "Save general settings"}</button></div>
  </form>;
}

function LanguageSettings({ locale, q, messages }: { locale: Locale; q: string; messages: Awaited<ReturnType<typeof listUiMessages>> }) {
  const ar = locale === "ar";
  return <>
    <TermSearch initialQuery={q} placeholder={ar ? "ابحث بالمفتاح أو النص…" : "Search key or text…"} countLabel={`${messages.length} ${ar ? "مصطلح" : "terms"}`}/>
    <details className="term-row term-new">
      <summary><div><code dir="ltr">+</code><span>{ar ? "إضافة مصطلح جديد" : "Add a new term"}</span></div><b>{ar ? "جديد" : "New"}</b></summary>
      <form action={saveUiMessage} className="term-form">
        <input type="hidden" name="locale" value={locale}/>
        <label className="term-key"><span>{ar ? "مفتاح المصطلح" : "Term key"}</span><input name="key" required maxLength={191} dir="ltr" placeholder="navigation.contact" pattern="[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*"/></label>
        <label dir="rtl"><span>{ar ? "النص العربي" : "Arabic text"}</span><textarea name="ar" required maxLength={2000}/></label>
        <label dir="ltr"><span>{ar ? "النص الإنجليزي" : "English text"}</span><textarea name="en" required maxLength={2000}/></label>
        <button className="dashboard-primary-action" type="submit">{ar ? "إضافة المصطلح" : "Add term"}</button>
      </form>
    </details>
    <section className="term-list" aria-label={ar ? "قاموس الواجهة" : "Interface dictionary"}>
      {messages.map(message => <details className="term-row" key={message.key}>
        <summary><div><code dir="ltr">{message.key}</code><span>{message.ar}</span></div><b>{message.overridden ? (ar ? "مخصص" : "Custom") : (ar ? "افتراضي" : "Default")}</b></summary>
        <form action={saveUiMessage} className="term-form">
          <input type="hidden" name="locale" value={locale}/><input type="hidden" name="key" value={message.key}/>
          <label dir="rtl"><span>{ar ? "النص العربي" : "Arabic text"}</span><textarea name="ar" required maxLength={2000} defaultValue={message.ar}/></label>
          <label dir="ltr"><span>{ar ? "النص الإنجليزي" : "English text"}</span><textarea name="en" required maxLength={2000} defaultValue={message.en}/></label>
          <button className="dashboard-primary-action" type="submit">{ar ? "حفظ المصطلح" : "Save term"}</button>
        </form>
      </details>)}
    </section>
  </>;
}

function ContactSettings({ locale, contact }: { locale: Locale; contact: CompanyContact }) {
  const ar = locale === "ar";
  const urlFields = ["instagram", "x", "linkedin", "snapchat", "tiktok", "youtube"] as const;
  return <form action={saveContactSettings} className="settings-contact-form"><input type="hidden" name="locale" value={locale}/>
    <section className="settings-contact-section"><div><h2>{ar ? "معلومات التواصل" : "Contact information"}</h2><p>{ar ? "تظهر هذه البيانات في صفحة التواصل والتذييل وأزرار الاتصال العامة." : "Shown on the contact page, footer, and global contact actions."}</p></div><div className="settings-contact-grid"><label><span>{ar ? "رقم الجوال الأساسي" : "Primary mobile"}</span><input name="primaryPhone" defaultValue={contact.primaryPhone ?? ""} maxLength={40} dir="ltr" placeholder="+966…"/></label><label><span>{ar ? "الرقم الموحد" : "Unified phone"}</span><input name="unifiedPhone" defaultValue={contact.unifiedPhone ?? ""} maxLength={40} dir="ltr"/></label><label><span>{ar ? "البريد التجاري" : "Business email"}</span><input name="businessEmail" type="email" defaultValue={contact.businessEmail ?? ""} maxLength={191} dir="ltr"/></label><label><span>{ar ? "رابط واتساب" : "WhatsApp URL"}</span><input name="whatsapp" type="url" defaultValue={contact.whatsapp ?? ""} maxLength={2048} dir="ltr" placeholder="https://wa.me/…"/></label><label className="settings-wide"><span>{ar ? "رابط الموقع على الخريطة" : "Map location URL"}</span><input name="mapUrl" type="url" defaultValue={contact.mapUrl ?? ""} maxLength={2048} dir="ltr" placeholder="https://…"/></label><label><span>{ar ? "العنوان بالعربية" : "Arabic address"}</span><textarea name="addressAr" defaultValue={contact.address.ar ?? ""} maxLength={1000} dir="rtl"/></label><label><span>{ar ? "العنوان بالإنجليزية" : "English address"}</span><textarea name="addressEn" defaultValue={contact.address.en ?? ""} maxLength={1000} dir="ltr"/></label></div></section>
    <section className="settings-contact-section"><div><h2>{ar ? "أوقات الدوام" : "Working hours"}</h2><p>{ar ? "اكتبها بصيغة واضحة كما تريد ظهورها للزائر." : "Enter the exact schedule visitors should see."}</p></div><div className="settings-contact-grid"><label><span>{ar ? "بالعربية" : "Arabic"}</span><textarea name="workingHoursAr" defaultValue={contact.workingHours.ar ?? ""} maxLength={1000} dir="rtl"/></label><label><span>{ar ? "بالإنجليزية" : "English"}</span><textarea name="workingHoursEn" defaultValue={contact.workingHours.en ?? ""} maxLength={1000} dir="ltr"/></label></div></section>
    <section className="settings-contact-section"><div><h2>{ar ? "منصات التواصل" : "Social media"}</h2><p>{ar ? "لن تظهر المنصة في الموقع إذا تُرك رابطها فارغًا." : "A platform stays hidden when its URL is empty."}</p></div><div className="settings-contact-grid">{urlFields.map(field => <label key={field}><span>{field}</span><input name={field} type="url" defaultValue={contact.social[field] ?? ""} maxLength={2048} dir="ltr" placeholder="https://…"/></label>)}</div></section>
    <div className="settings-form-footer"><p>{ar ? "تُحدّث بيانات التواصل في جميع أجزاء الموقع بعد الحفظ." : "Saving updates contact details across the website."}</p><button className="dashboard-primary-action" type="submit">{ar ? "حفظ بيانات التواصل" : "Save contact settings"}</button></div>
  </form>;
}

export default async function SettingsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const { locale: localeValue } = await params;
  if (!isLocale(localeValue)) notFound();
  const locale = localeValue as Locale;
  const principal = await requirePermission("settings.manage", locale);
  const { q = "", tab: requestedTab } = await searchParams;
  const tab = requestedTab === "language" ? "language" : requestedTab === "contact" ? "contact" : "general";
  const ar = locale === "ar";
  const base = localizedPath(locale, "/dashboard/settings");
  const generalData = tab === "general" ? await Promise.all([getBrandAssets(), listBrandMedia(principal)]) : null;
  const messages = tab === "language" ? await listUiMessages(q) : null;
  const contact = tab === "contact" ? await getCompanyContact() : null;
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "إعدادات الموقع" : "Site settings"}</p><h1>{ar ? "الإعدادات" : "Settings"}</h1><span>{ar ? "تحكم في الهوية العامة ونصوص الواجهة من مكان واحد." : "Manage the global identity and interface copy from one place."}</span></div></section>
    <nav className="settings-tabs" aria-label={ar ? "أقسام الإعدادات" : "Settings sections"}>
      <a className={tab === "general" ? "active" : ""} href={`${base}?tab=general`}>{ar ? "إعدادات عامة" : "General settings"}</a>
      <a className={tab === "contact" ? "active" : ""} href={`${base}?tab=contact`}>{ar ? "التواصل والدوام" : "Contact & hours"}</a>
      <a className={tab === "language" ? "active" : ""} href={`${base}?tab=language`}>{ar ? "المصطلحات واللغة" : "Language & terminology"}</a>
    </nav>
    {generalData ? <GeneralSettings locale={locale} principal={principal} assets={generalData[0]} media={generalData[1]}/> : contact ? <ContactSettings locale={locale} contact={contact}/> : messages ? <LanguageSettings locale={locale} q={q} messages={messages}/> : null}
  </>;
}
