import Image from "next/image";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/guards";
import { listMedia, mediaPreviewPath } from "@/features/media/admin";
import { hasPermission } from "@/features/auth/permissions";
import { uploadMedia } from "./actions";
import { isLocale } from "@/lib/i18n/config";

export default async function MediaDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const principal = await requirePermission("media.read", locale);
  const media = await listMedia(principal);
  const ar = locale === "ar";
  return <>
    <section className="dashboard-heading"><div><p>{ar ? "إدارة المحتوى" : "Content management"}</p><h1>{ar ? "مكتبة الوسائط" : "Media library"}</h1><span>{ar ? `${media.length} ملفًا مسجلًا في قاعدة البيانات` : `${media.length} files registered in the database`}</span></div></section>
    {hasPermission(principal, "media.upload") && <form className="media-upload-form" action={uploadMedia}><input type="hidden" name="locale" value={locale}/><label><span>{ar ? "رفع صورة جديدة" : "Upload new image"}</span><input type="file" name="file" accept="image/png,image/jpeg,image/webp" required/></label><button type="submit">{ar ? "رفع إلى المكتبة" : "Upload to library"}</button><small>{ar ? "PNG أو JPEG أو WebP، بحد أقصى 5MB" : "PNG, JPEG or WebP, up to 5MB"}</small></form>}
    {media.length === 0 ? <section className="dashboard-module-empty"><span>+</span><h2>{ar ? "لا توجد وسائط" : "No media"}</h2><p>{ar ? "لا توجد ملفات مسجلة في قاعدة البيانات حاليًا." : "No files are currently registered in the database."}</p></section> : <section className="media-library-grid" aria-label={ar ? "ملفات الوسائط" : "Media files"}>
      {media.map(item => {
        const src = item.isPublic && item.status === "ACTIVE" ? mediaPreviewPath(item.id, item.storageKey) : null;
        const references = item._count.lightLogoClients + item._count.darkLogoClients + item._count.projects;
        return <article className="media-card" key={item.id}>
          <div className="media-preview">{src ? <Image src={src} alt="" width={item.width ?? 640} height={item.height ?? 360} unoptimized/> : <span aria-hidden="true">W</span>}</div>
          <div className="media-card-copy"><h2 dir="ltr">{item.storageKey}</h2><p>{item.purpose}</p><dl><div><dt>{ar ? "النوع" : "Type"}</dt><dd dir="ltr">{item.mimeType}</dd></div><div><dt>{ar ? "الحجم" : "Size"}</dt><dd>{formatBytes(item.sizeBytes, locale)}</dd></div><div><dt>{ar ? "الاستخدامات" : "Uses"}</dt><dd>{new Intl.NumberFormat(locale).format(references)}</dd></div><div><dt>{ar ? "الحالة" : "Status"}</dt><dd>{item.status}</dd></div></dl></div>
        </article>;
      })}
    </section>}
  </>;
}

function formatBytes(bytes: bigint, locale: string) {
  const value = Number(bytes);
  if (value < 1024) return `${new Intl.NumberFormat(locale).format(value)} B`;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value / 1024)} KB`;
}
