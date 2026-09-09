import { beforeEach, afterEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ headers: vi.fn(), session: vi.fn(), user: vi.fn() }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/auth/server", () => ({ getAuth: () => ({ api: { getSession: mocks.session } }) }));
vi.mock("@/db/client", () => ({ getDb: () => ({ user: { findUnique: mocks.user } }) }));
import { getPrincipal } from "@/features/auth/session";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "mysql://unit-only");
  vi.stubEnv("BETTER_AUTH_SECRET", "unit-test-only-not-a-real-secret-value");
  vi.stubEnv("AUTH_SECRET", "");
  mocks.headers.mockResolvedValue(new Headers({ cookie: "unit-only=value" }));
  mocks.session.mockResolvedValue({ user: { id: "unit-user" }, session: { expiresAt: new Date(Date.now() + 60000) } });
});
afterEach(() => vi.unstubAllEnvs());
it("denies unconfigured auth without querying a database", async () => {
  vi.stubEnv("BETTER_AUTH_SECRET", "");
  expect(await getPrincipal()).toBeNull(); expect(mocks.user).not.toHaveBeenCalled();
});
it("denies a missing or expired session", async () => {
  mocks.session.mockResolvedValueOnce(null);
  expect(await getPrincipal()).toBeNull();
  mocks.session.mockResolvedValueOnce({ user: { id: "unit-user" }, session: { expiresAt: new Date(0) } });
  expect(await getPrincipal()).toBeNull(); expect(mocks.user).not.toHaveBeenCalled();
});
it("rejects a disabled account even with a valid session", async () => {
  mocks.user.mockResolvedValue({ id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false, status: "DISABLED", roles: [] });
  expect(await getPrincipal()).toBeNull();
});
it("reloads grants so revoked permissions are not retained", async () => {
  mocks.user.mockResolvedValueOnce({ id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false, status: "ACTIVE", roles: [
    { role: { permissions: [{ permission: { key: "dashboard.access" } }] } },
  ] }).mockResolvedValueOnce({ id: "unit-user", name: "Unit", email: "unit@example.test", mustChangePassword: false, status: "ACTIVE", roles: [] });
  expect((await getPrincipal())?.permissions).toEqual(["dashboard.access"]);
  expect((await getPrincipal())?.permissions).toEqual([]);
});
