import { expect, it, vi } from "vitest";

const findMany = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock("@/db/client", () => ({ getDb: () => ({ lead: { findMany } }) }));
import { listLeads } from "@/features/leads/admin";

const principal = { id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false };

it("denies lead listing without a lead read permission", async () => {
  await expect(listLeads({ ...principal, permissions: [] }, "", "")).rejects.toThrow("FORBIDDEN");
  expect(findMany).not.toHaveBeenCalled();
});

it("limits assigned-only users to their own leads", async () => {
  await listLeads({ ...principal, permissions: ["leads.read.assigned"] }, "", "NEW");
  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ assignedUserId: "unit-user", status: "NEW" }), take: 100 }));
});

it("does not scope all-lead readers to an assignee", async () => {
  await listLeads({ ...principal, permissions: ["leads.read.all"] }, "", "");
  const call = findMany.mock.calls.at(-1)?.[0];
  expect(call.where.assignedUserId).toBeUndefined();
});
