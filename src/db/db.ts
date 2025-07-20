import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "~/lib/env";

import * as schema from "~/db/schema";

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: "snake_case",
});
