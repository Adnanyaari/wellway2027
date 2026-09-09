import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDb } from "@/db/client";
import { hasPermission, type Principal } from "@/features/auth/permissions";

const maxBytes = 5 * 1024 * 1024;
const types = [{ mime: "image/png", ext: "png", test: (b: Buffer) => b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) }, { mime: "image/jpeg", ext: "jpg", test: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff }, { mime: "image/webp", ext: "webp", test: (b: Buffer) => b.subarray(0,4).toString() === "RIFF" && b.subarray(8,12).toString() === "WEBP" }];

export function mediaRoot() { return path.resolve(/* turbopackIgnore: true */ process.env.MEDIA_STORAGE_ROOT || path.join(process.cwd(), ".data", "media")); }

export async function storeImage(principal: Principal, file: File, purpose: string) {
  if (!hasPermission(principal, "media.upload")) throw new Error("FORBIDDEN");
  if (!file.size || file.size > maxBytes) throw new Error("INVALID_MEDIA");
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = types.find(candidate => candidate.test(buffer));
  if (!type) throw new Error("INVALID_MEDIA");
  const key = `${randomUUID()}.${type.ext}`;
  const root = mediaRoot();
  await mkdir(root, { recursive: true });
  const target = path.join(/* turbopackIgnore: true */ root, key);
  await writeFile(target, buffer, { flag: "wx" });
  try {
    return await getDb().$transaction(async tx => {
      const media = await tx.media.create({ data: { storageKey: `uploads/${key}`, mimeType: type.mime, sizeBytes: file.size, purpose, isPublic: true, status: "ACTIVE", sourceReference: `DASHBOARD:${principal.id}`, ownershipReference: `DASHBOARD:${principal.id}` }, select: { id: true } });
      await tx.auditLog.create({ data: { actorId: principal.id, action: "media.upload", targetType: "media", targetId: media.id, outcome: "SUCCESS" } });
      return media;
    });
  } catch (error) { await unlink(target).catch(() => undefined); throw error; }
}

export async function readStoredImage(storageKey: string) {
  if (!storageKey.startsWith("uploads/") || !/^[a-zA-Z0-9._/-]+$/.test(storageKey)) throw new Error("INVALID_MEDIA_PATH");
  const filename = storageKey.slice("uploads/".length);
  const target = path.resolve(mediaRoot(), filename);
  if (path.dirname(target) !== mediaRoot()) throw new Error("INVALID_MEDIA_PATH");
  return readFile(/* turbopackIgnore: true */ target);
}
