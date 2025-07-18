import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/lib/env";

import * as othersSchema from "~/db/schema/others";
import * as authSchema from "~/db/schema/auth";

const schema = { ...authSchema, ...othersSchema };
const poolConnection = mysql.createPool({ uri: env.DATABASE_URL });

export const db = drizzle({
  client: poolConnection,
  schema,
  mode: "default",
  casing: "snake_case",
});
