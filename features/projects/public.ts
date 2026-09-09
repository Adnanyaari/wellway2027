import "server-only";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";

export type PublishedProject = {
  id: string;
  title: string;
  summary: string | null;
  slug: string;
  clientName: string;
  services: string[];
  image: { src: string; alt: string; width: number; height: number } | null;
};

export async function getPublishedProjects(locale: Locale): Promise<PublishedProject[]> {
  const rows = await getDb().projectTranslation.findMany({
    where: {
      locale,
      status: "PUBLISHED",
      project: {
        status: "ACTIVE",
        client: {
          status: "ACTIVE",
          approvedAt: { not: null },
          translations: { some: { locale, status: "PUBLISHED" } },
        },
        services: {
          some: {
            service: {
              status: "ACTIVE",
              translations: { some: { locale, status: "PUBLISHED" } },
            },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      summary: true,
      slug: true,
      project: {
        select: {
          client: {
            select: {
              translations: {
                where: { locale, status: "PUBLISHED" },
                select: { name: true },
                take: 1,
              },
            },
          },
          services: {
            where: {
              service: {
                status: "ACTIVE",
                translations: { some: { locale, status: "PUBLISHED" } },
              },
            },
            select: {
              service: {
                select: {
                  translations: {
                    where: { locale, status: "PUBLISHED" },
                    select: { title: true },
                    take: 1,
                  },
                },
              },
            },
          },
          media: {
            where: {
              role: "gallery",
              media: {
                isPublic: true,
                status: "ACTIVE",
                translations: { some: { locale, status: "PUBLISHED" } },
              },
            },
            select: {
              media: {
                select: {
                  storageKey: true,
                  width: true,
                  height: true,
                  translations: {
                    where: { locale, status: "PUBLISHED" },
                    select: { altText: true, decorative: true },
                    take: 1,
                  },
                },
              },
            },
            orderBy: { position: "asc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  return rows.flatMap((row) => {
    const clientName = row.project.client.translations[0]?.name;
    if (!clientName) return [];
    const media = row.project.media[0]?.media;
    const translation = media?.translations[0];
    const safePath = media && isSafePublicPath(media.storageKey) ? `/${media.storageKey.replace(/^\/+/, "")}` : null;
    const image = safePath && translation && (translation.decorative || translation.altText)
      ? {
          src: safePath,
          alt: translation.decorative ? "" : (translation.altText ?? ""),
          width: media.width ?? 1200,
          height: media.height ?? 800,
        }
      : null;

    return [{
      id: row.id,
      title: row.title,
      summary: row.summary,
      slug: row.slug,
      clientName,
      services: row.project.services.flatMap(({ service }) =>
        service.translations[0]?.title ? [service.translations[0].title] : []),
      image,
    }];
  });
}

function isSafePublicPath(storageKey: string) {
  return !storageKey.includes("..") && !storageKey.includes("\\") && /^[a-zA-Z0-9/_\-.]+$/.test(storageKey);
}
