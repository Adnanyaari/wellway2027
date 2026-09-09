import { headers } from "next/headers";
import { z } from "zod";
import { getAuth } from "@/lib/auth/server";
import { getDb } from "@/db/client";
import { getPrincipal } from "@/features/auth/session";
import { getSiteConfig } from "@/lib/env";

const inputSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(6).max(128),
  confirmPassword: z.string().min(6).max(128),
}).refine(value => value.newPassword === value.confirmPassword, { path: ["confirmPassword"] })
  .refine(value => value.currentPassword !== value.newPassword, { path: ["newPassword"] });

export async function POST(request: Request) {
  if (request.headers.get("origin") !== getSiteConfig().origin) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const principal = await getPrincipal();
  if (!principal) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!principal.mustChangePassword) return Response.json({ error: "not_required" }, { status: 409 });

  const input = inputSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return Response.json({ error: "invalid_password" }, { status: 400 });

  try {
    await getAuth().api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: input.data.currentPassword,
        newPassword: input.data.newPassword,
        revokeOtherSessions: true,
      },
    });
    await getDb().user.update({
      where: { id: principal.id },
      data: { mustChangePassword: false },
      select: { id: true },
    });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "change_failed" }, { status: 400 });
  }
}
