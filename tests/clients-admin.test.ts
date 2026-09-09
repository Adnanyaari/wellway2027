import { expect, it, vi } from "vitest";

const findMany = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock("@/db/client", () => ({ getDb: () => ({ client: { findMany } }) }));
import { listClients } from "@/features/clients/admin";

const principal = { id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false };

it("denies the client list without clients.read", async () => {
  await expect(listClients({ ...principal, permissions: [] }, "")).rejects.toThrow("FORBIDDEN");
  expect(findMany).not.toHaveBeenCalled();
});

it("uses a bounded client query for authorized users", async () => {
  await listClients({ ...principal, permissions: ["clients.read"] }, "Well Way");
  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }));
});
