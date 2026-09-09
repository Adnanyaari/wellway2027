import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Hero, type HeroSlide } from "@/components/home/hero";
import { ClientsStrip } from "@/components/home/clients-strip";
import { ServicesCarousel } from "@/components/home/services-carousel";
import { AchievementsStrip } from "@/components/home/achievements-strip";
import { SelectedWork } from "@/components/home/selected-work";
import { getPublishedAchievements } from "@/features/achievements/public";
import { getPublishedClients } from "@/features/clients/public";
import { getPublishedServices } from "@/features/services/public";
import { getPublishedProjects } from "@/features/projects/public";
import { getPublishedHomeContent } from "@/features/pages/home";
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
  const [clients, services, achievements, projects, homeContent] = await Promise.all([
    getPublishedClients(locale),
    getPublishedServices(locale),
    getPublishedAchievements(locale),
    getPublishedProjects(locale),
    getPublishedHomeContent(locale),
  ]);
  const hero = homeContent?.hero;
  const slides: HeroSlide[] = [{
    id: "well-way",
    eyebrow: hero?.eyebrow || (locale === "ar" ? messages.home.heroEyebrow : null),
    headline: hero?.headline || (locale === "ar" ? "تسويق سعودي يوصلك بالعالم" : "WELL WAY"),
    description: hero?.description || (locale === "ar" ? null : messages.pending),
    ctaLabel: hero?.primaryLabel || messages.home.startProject,
    ctaHref: localizedPath(locale, hero?.primaryHref || "/contact"),
    portfolioLabel: hero?.secondaryLabel || (locale === "ar" ? "معرض الأعمال" : "Our work"),
    portfolioHref: localizedPath(locale, hero?.secondaryHref || "/projects"),
    lightImage: homeContent?.heroLightImage ?? homeContent?.heroDarkImage ?? null,
    darkImage: homeContent?.heroDarkImage ?? homeContent?.heroLightImage ?? null,
  }];
  return <Shell locale={locale}>
    <Hero slides={slides} labels={messages.home.carousel}/>
    <ClientsStrip clients={clients} title={messages.home.clientsTitle}/>
    <ServicesCarousel services={services} labels={messages.home.servicesCarousel}/>
    <AchievementsStrip achievements={achievements} label={messages.home.statisticsTitle} locale={locale}/>
    <SelectedWork projects={projects} locale={locale} labels={messages.home.selectedWork}/>
  </Shell>;
}
