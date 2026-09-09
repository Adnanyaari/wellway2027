import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { readStoredImage } from "@/features/media/storage";

export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getDb().media.findFirst({ where: { id, isPublic: true, status: "ACTIVE", storageKey: { startsWith: "uploads/" } }, select: { storageKey: true, mimeType: true } });
  if (!media) return new NextResponse(null, { status: 404 });
  try { return new NextResponse(await readStoredImage(media.storageKey), { headers: { "Content-Type": media.mimeType, "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } }); }
  catch { return new NextResponse(null, { status: 404 }); }
}
