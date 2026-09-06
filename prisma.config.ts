import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "db/schema.prisma",
  migrations: { path: "db/migrations" },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});