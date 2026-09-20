import { NextResponse, type NextRequest } from "next/server";
import { getBrandAssets } from "@/features/site-settings/public";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const assets = await getBrandAssets();
  const path = assets.favicon?.path ?? assets.light.path;
  const response = NextResponse.redirect(new URL(path, request.url), 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
