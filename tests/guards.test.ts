import { expect, it, vi } from "vitest";

const principal = vi.hoisted(() => vi.fn());
vi.mock("@/features/auth/session", () => ({ getPrincipal: principal }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => { throw new Error(`redirect:${path}`); },
  notFound: () => { throw new Error("not-found"); },
}));
import { requirePermission } from "@/features/auth/guards";

it("redirects anonymous requests to the requested locale's auth boundary", async () => {
  principal.mockResolvedValue(null);
  await expect(requirePermission("dashboard.access", "ar")).rejects.toThrow("redirect:/ar/auth/login");
  await expect(requirePermission("dashboard.access", "en")).rejects.toThrow("redirect:/en/auth/login");
});
it("denies authenticated users without the required capability", async () => {
  principal.mockResolvedValue({ id: "unit-user", permissions: [] });
  await expect(requirePermission("dashboard.access", "en")).rejects.toThrow("not-found");
});
it("returns a principal only after permission verification", async () => {
  const allowed = { id: "unit-user", permissions: ["dashboard.access"] };
  principal.mockResolvedValue(allowed);
  await expect(requirePermission("dashboard.access", "en")).resolves.toEqual(allowed);
});
