import { defineConfig } from "drizzle-kit";
import { env } from "~/lib/env";

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/migrations",
  dialect: "mysql",
  casing: "snake_case",
  dbCredentials: { url: env.DATABASE_URL },
});
