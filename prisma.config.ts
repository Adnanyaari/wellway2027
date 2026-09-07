import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { defineConfig } from "prisma/config";
import { parseMysqlDatabaseUrl } from "./lib/database-url";

const migrationDatabaseUrl = parseMysqlDatabaseUrl(
  process.env.MIGRATION_DATABASE_URL,
  "MIGRATION_DATABASE_URL",
);

export default defineConfig({
  schema: "db/schema.prisma",
  migrations: { path: "db/migrations" },
  datasource: {
    url: migrationDatabaseUrl,
  },
});
