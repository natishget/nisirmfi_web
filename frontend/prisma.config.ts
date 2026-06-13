import "dotenv/config";

import { defineConfig } from "prisma/config";

const rawUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
const databaseUrl = rawUrl.includes("\\$") ? rawUrl.replace(/\\(\$)/g, "$1") : rawUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
