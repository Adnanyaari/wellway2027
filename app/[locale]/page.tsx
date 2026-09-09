import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Hero, type HeroSlide } from "@/components/home/hero";
import { ClientsStrip } from "@/components/home/clients-strip";
import { ServicesCarousel } from "@/components/home/services-carousel";
import { AchievementsStrip } from "@/components/home/achievements-strip";
import { getPublishedAchievements } from "@/features/achievements/public";
import { getPublishedClients } from "@/features/clients/public";
import { getPublishedServices } from "@/features/services/public";
import { getSiteConfig } from "@/lib/env";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return localeMetadata(getSiteConfig().origin, locale, getMessages(locale).title);
}
export default async function LocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const [clients, services, achievements] = await Promise.all([
    getPublishedClients(locale),
    getPublishedServices(locale),
    getPublishedAchievements(locale),
  ]);
  const slides: HeroSlide[] = [{
    id: "well-way",
    eyebrow: locale === "ar" ? messages.home.heroEyebrow : null,
    headline: locale === "ar" ? "تسويق سعودي يوصلك بالعالم" : "WELL WAY",
    description: locale === "ar" ? null : messages.pending,
    ctaLabel: messages.home.startProject,
    ctaHref: localizedPath(locale, "/contact"),
    portfolioLabel: locale === "ar" ? "معرض الأعمال" : "Our work",
    portfolioHref: localizedPath(locale, "/projects"),
  }];
  return <Shell locale={locale}>
    <Hero slides={slides} labels={messages.home.carousel}/>
    <ClientsStrip clients={clients} title={messages.home.clientsTitle}/>
    <ServicesCarousel services={services} labels={messages.home.servicesCarousel}/>
    <AchievementsStrip achievements={achievements} label={messages.home.statisticsTitle} locale={locale}/>
  </Shell>;
}
