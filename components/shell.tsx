import { ThemeSwitcher } from "@/components/theme/switcher";
import { getMessages } from "@/lib/i18n/messages";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const messages = getMessages(locale);
  return <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 px-6 py-12">
    <nav aria-label={messages.language} className="flex flex-wrap items-center justify-between gap-4">
      {/* Full locale navigation refreshes the shared root document's lang and dir. */}
      <div className="flex gap-4"><a href={localizedPath("ar")} lang="ar" hrefLang="ar">العربية</a>
        <a href={localizedPath("en")} lang="en" hrefLang="en">English</a></div>
      <ThemeSwitcher labels={messages} />
    </nav>
    <section className="space-y-4">{children}</section>
  </main>;
}
