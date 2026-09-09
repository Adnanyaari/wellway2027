import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ principal: vi.fn(), changePassword: vi.fn(), update: vi.fn() }));
vi.mock("@/features/auth/session", () => ({ getPrincipal: mocks.principal }));
vi.mock("@/lib/auth/server", () => ({ getAuth: () => ({ api: { changePassword: mocks.changePassword } }) }));
vi.mock("@/db/client", () => ({ getDb: () => ({ user: { update: mocks.update } }) }));
vi.mock("next/headers", () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }));
import { POST } from "@/app/api/account/change-initial-password/route";

beforeEach(() => {
  vi.stubEnv("SITE_URL", "http://localhost:3000");
  mocks.principal.mockReset();
  mocks.changePassword.mockReset();
  mocks.update.mockReset();
});

it("rejects a cross-origin initial-password change", async () => {
  const response = await POST(new Request("http://localhost:3000/api/account/change-initial-password", {
    method: "POST", headers: { origin: "https://attacker.invalid", "content-type": "application/json" }, body: "{}",
  }));
  expect(response.status).toBe(403);
  expect(mocks.principal).not.toHaveBeenCalled();
});

it("rejects an unauthenticated initial-password change", async () => {
  mocks.principal.mockResolvedValue(null);
  const response = await POST(new Request("http://localhost:3000/api/account/change-initial-password", {
    method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json" }, body: "{}",
  }));
  expect(response.status).toBe(401);
});

it("requires six characters for the replacement password", async () => {
  mocks.principal.mockResolvedValue({ id: "unit-user", mustChangePassword: true });
  const short = await POST(new Request("http://localhost:3000/api/account/change-initial-password", {
    method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json" },
    body: JSON.stringify({ currentPassword: "1234", newPassword: "12345", confirmPassword: "12345" }),
  }));
  expect(short.status).toBe(400);
  expect(mocks.changePassword).not.toHaveBeenCalled();

  mocks.changePassword.mockResolvedValue({});
  mocks.update.mockResolvedValue({ id: "unit-user" });
  const accepted = await POST(new Request("http://localhost:3000/api/account/change-initial-password", {
    method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json" },
    body: JSON.stringify({ currentPassword: "1234", newPassword: "123456", confirmPassword: "123456" }),
  }));
  expect(accepted.status).toBe(200);
  expect(mocks.changePassword).toHaveBeenCalledOnce();
});
