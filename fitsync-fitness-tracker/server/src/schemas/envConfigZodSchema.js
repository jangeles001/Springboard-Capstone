import { z } from "zod";

export const envConfigZodSchema = z.object({
  CLIENT_ORIGIN: z.string(),
  MONGO_URI: z
    .string()
    .startsWith("mongodb", "Mongodb url should start with mongodb:"),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  JWT_SECRET: z
    .string()
    .min(8, "JWT_SECRET needs to be at minimum 8 characters"),
  REDIS_URL: z
    .string()
    .startsWith("redis", "Redis url should start with redis:"),
});
