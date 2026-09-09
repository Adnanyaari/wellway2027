import { expect, it, vi } from "vitest";

const findMany = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock("@/db/client", () => ({ getDb: () => ({ media: { findMany } }) }));
import { listMedia, publicMediaPath } from "@/features/media/admin";

const principal = { id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false };

it("denies the media library without media.read", async () => {
  await expect(listMedia({ ...principal, permissions: [] })).rejects.toThrow("FORBIDDEN");
  expect(findMany).not.toHaveBeenCalled();
});

it("uses a bounded media query and rejects unsafe public paths", async () => {
  await listMedia({ ...principal, permissions: ["media.read"] });
  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }));
  expect(publicMediaPath("brand/logo.webp")).toBe("/brand/logo.webp");
  expect(publicMediaPath("../secret.png")).toBeNull();
});
