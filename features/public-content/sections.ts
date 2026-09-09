import "server-only";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";

export const publicSections = ["about", "projects", "clients", "blog", "faqs", "contact", "privacy", "terms"] as const;
export type PublicSection = (typeof publicSections)[number];
export function isPublicSection(value: string): value is PublicSection { return publicSections.includes(value as PublicSection); }

export type SectionEntry = { id: string; title: string; summary: string | null; slug: string | null; kind: "content" | "project" | "client" | "post" | "faq" };

export async function getPublishedSectionEntries(section: PublicSection, locale: Locale): Promise<SectionEntry[]> {
  const db = getDb();
  if (section === "projects") return (await db.projectTranslation.findMany({ where: { locale, status: "PUBLISHED", project: { status: "ACTIVE" } }, select: { id: true, title: true, summary: true, slug: true }, orderBy: { createdAt: "desc" } })).map(item => ({ ...item, kind: "project" }));
  if (section === "clients") return (await db.clientTranslation.findMany({ where: { locale, status: "PUBLISHED", client: { status: "ACTIVE" } }, select: { id: true, name: true, description: true }, orderBy: { createdAt: "asc" } })).map(item => ({ id: item.id, title: item.name, summary: item.description, slug: null, kind: "client" }));
  if (section === "blog") return (await db.postTranslation.findMany({ where: { locale, status: "PUBLISHED", post: { status: "ACTIVE" } }, select: { id: true, title: true, summary: true, slug: true }, orderBy: { createdAt: "desc" } })).map(item => ({ ...item, kind: "post" }));
  if (section === "faqs") return (await db.faqTranslation.findMany({ where: { locale, status: "PUBLISHED", faq: { status: "ACTIVE" } }, select: { id: true, question: true, answer: true }, orderBy: { faq: { position: "asc" } } })).map(item => ({ id: item.id, title: item.question, summary: item.answer, slug: null, kind: "faq" }));
  if (section === "contact") return [];
  const page = await db.pageTranslation.findFirst({ where: { locale, status: "PUBLISHED", page: { key: section, status: "ACTIVE" } }, select: { id: true, title: true, body: true, slug: true } });
  return page ? [{ id: page.id, title: page.title, summary: page.body, slug: page.slug, kind: "content" }] : [];
}
