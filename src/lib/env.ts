import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(10),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_ENDPOINT: z.url(),
    S3_REGION: z.string(),
    S3_BUCKET: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
