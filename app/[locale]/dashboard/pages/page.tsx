import { notFound } from "next/navigation";
import Image from "next/image";
import { requirePermission } from "@/features/auth/guards";
import { hasPermission } from "@/features/auth/permissions";
import { getHomePageAdmin, listHeroMedia, type HomePageContent } from "@/features/pages/home";
import { mediaPreviewPath } from "@/features/media/admin";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { saveHomeHero, setHomePublished } from "./actions";

function fallback(locale: Locale): HomePageContent {
  const messages = getMessages(locale);
  return { version: 1, hero: {
    eyebrow: "WELL WAY", headline: locale === "ar" ? "تسويق سعودي يوصلك بالعالم" : "WELL WAY",
    description: locale === "ar" ? "" : messages.pending,
    primaryLabel: messages.home.startProject, primaryHref: "/contact",
    secondaryLabel: locale === "ar" ? "معرض الأعمال" : "Our work", secondaryHref: "/projects",
  } };
}

export default async function PagesDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await requirePermission("pages.read", locale);
  const [page, media] = await Promise.all([getHomePageAdmin(principal), listHeroMedia(principal)]);
  const ar = locale === "ar";
  const translations = new Map(page?.translations.map(item => [item.locale, item]));
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "إدارة المحتوى" : "Content management"}</p><h1>{ar ? "الصفحات" : "Pages"}</h1><span>{ar ? "تحكم بمحتوى كل صفحة وترجماتها ثم انشر النسخة المعتمدة." : "Manage each page and its translations, then publish the approved version."}</span></div></section>
    <div className="page-manager-list"><details className="client-accordion" open>
      <summary className="page-manager-row"><div><span className="client-avatar">ر</span><div><h2>{ar ? "الصفحة الرئيسية" : "Home page"}</h2><p>{ar ? "الهيرو وأقسام الصفحة الرئيسية" : "Hero and homepage sections"}</p></div></div><span className="client-accordion-toggle">⌄</span></summary>
      <div className="client-accordion-body"><details className="page-section-accordion" open><summary><div><h3>{ar ? "الهيرو" : "Hero"}</h3><p>{ar ? "النصوص والأزرار في أول الصفحة" : "Copy and actions at the top of the page"}</p></div><span>⌄</span></summary>
        <div className="page-locale-grid">{(["ar", "en"] as const).map(contentLocale => {
          const translation = translations.get(contentLocale); const value = translation?.content ?? fallback(contentLocale); const published = translation?.status === "PUBLISHED";
          return <article className="page-locale-card" key={contentLocale} dir={contentLocale === "ar" ? "rtl" : "ltr"}>
            <header><div><strong>{contentLocale === "ar" ? "العربية" : "English"}</strong><span className={published ? "status-active" : "status-archived"}>{published ? (ar ? "منشور" : "Published") : (ar ? "مسودة" : "Draft")}</span></div></header>
            {hasPermission(principal, "pages.update") && <form action={saveHomeHero} className="page-content-form">
              <input type="hidden" name="locale" value={locale}/><input type="hidden" name="contentLocale" value={contentLocale}/>
              <label><span>{ar ? "النص الصغير" : "Eyebrow"}</span><input name="eyebrow" maxLength={100} defaultValue={value.hero.eyebrow}/></label>
              <label><span>{ar ? "العنوان الرئيسي" : "Headline"}</span><input name="headline" required minLength={2} maxLength={191} defaultValue={value.hero.headline}/></label>
              <label><span>{ar ? "الوصف" : "Description"}</span><textarea name="description" maxLength={1000} defaultValue={value.hero.description}/></label>
              <div className="page-field-pair"><label><span>{ar ? "نص الزر الأساسي" : "Primary label"}</span><input name="primaryLabel" required maxLength={100} defaultValue={value.hero.primaryLabel}/></label><label><span>{ar ? "مسار الزر" : "Primary path"}</span><input name="primaryHref" required maxLength={255} dir="ltr" defaultValue={value.hero.primaryHref}/></label></div>
              <div className="page-field-pair"><label><span>{ar ? "نص زر الأعمال" : "Work label"}</span><input name="secondaryLabel" required maxLength={100} defaultValue={value.hero.secondaryLabel}/></label><label><span>{ar ? "مسار الزر" : "Work path"}</span><input name="secondaryHref" required maxLength={255} dir="ltr" defaultValue={value.hero.secondaryHref}/></label></div>
              <div className="page-field-pair"><label><span>{ar ? "صورة الهيرو — الوضع الفاتح" : "Hero image — light mode"}</span><select name="heroLightMediaId" defaultValue={translation?.heroLightMediaId ?? ""}><option value="">{ar ? "بدون صورة" : "No image"}</option>{media.map(item => <option key={item.id} value={item.id}>{item.storageKey}</option>)}</select></label>{hasPermission(principal, "media.upload") && <label><span>{ar ? "أو ارفع صورة فاتحة" : "Or upload light image"}</span><input name="heroLightFile" type="file" accept="image/png,image/jpeg,image/webp"/></label>}</div>
              <div className="page-field-pair"><label><span>{ar ? "صورة الهيرو — الوضع الداكن" : "Hero image — dark mode"}</span><select name="heroDarkMediaId" defaultValue={translation?.heroDarkMediaId ?? ""}><option value="">{ar ? "بدون صورة" : "No image"}</option>{media.map(item => <option key={item.id} value={item.id}>{item.storageKey}</option>)}</select></label>{hasPermission(principal, "media.upload") && <label><span>{ar ? "أو ارفع صورة داكنة" : "Or upload dark image"}</span><input name="heroDarkFile" type="file" accept="image/png,image/jpeg,image/webp"/></label>}</div>
              {(translation?.heroLightMediaId || translation?.heroDarkMediaId) && <div className="hero-media-previews">{media.filter(item => item.id === translation?.heroLightMediaId || item.id === translation?.heroDarkMediaId).map(item => <Image key={item.id} src={mediaPreviewPath(item.id, item.storageKey) ?? ""} alt="" width={320} height={180} unoptimized/>)}</div>}
              <button className="dashboard-primary-action" type="submit">{ar ? "حفظ كمسودة" : "Save as draft"}</button>
            </form>}
            {translation && hasPermission(principal, "pages.publish") && <form action={setHomePublished} className="page-publish-form"><input type="hidden" name="locale" value={locale}/><input type="hidden" name="contentLocale" value={contentLocale}/><input type="hidden" name="published" value={published ? "false" : "true"}/><button type="submit">{published ? (ar ? "إلغاء النشر" : "Unpublish") : (ar ? "نشر في الموقع" : "Publish to website")}</button></form>}
          </article>;
        })}</div>
      </details></div>
    </details>
    {[ar ? "من نحن" : "About", ar ? "الخدمات" : "Services", ar ? "المشاريع" : "Projects", ar ? "تواصل معنا" : "Contact"].map(label => <div className="page-manager-row page-manager-pending" key={label}><div><span className="client-avatar">{label.slice(0, 1)}</span><div><h2>{label}</h2><p>{ar ? "تتم إضافة إعدادات أقسامها في المرحلة التالية" : "Section controls will be added in the next phase"}</p></div></div></div>)}
    </div>
  </>;
}
