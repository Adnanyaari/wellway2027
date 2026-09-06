export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() {
  // Liveness only. No credentials, database details, or misleading readiness claim.
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
