import { getDb } from "@/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET() {
  try {
    const db = getDb();
    await Promise.all([
      db.siteSetting.findFirst({ select: { id: true } }),
      db.pageTranslation.findFirst({
        select: { id: true, heroLightMediaId: true, heroDarkMediaId: true },
      }),
      db.achievement.findFirst({ select: { id: true } }),
    ]);

    return Response.json({ status: "ready" }, { headers });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers });
  }
}
