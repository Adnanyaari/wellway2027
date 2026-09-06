import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/db/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/env";

const globalDatabase = globalThis as unknown as { wellwayPrisma?: PrismaClient };
export function getDb(): PrismaClient {
  if (!globalDatabase.wellwayPrisma) {
    const url = new URL(getDatabaseUrl());
    const adapter = new PrismaMariaDb({
      host: url.hostname, port: Number(url.port || 3306),
      user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.slice(1)), connectionLimit: 5,
      connectTimeout: 5000, acquireTimeout: 5000,
    });
    globalDatabase.wellwayPrisma = new PrismaClient({ adapter, log: ["warn"] });
  }
  return globalDatabase.wellwayPrisma;
}
