import { z } from "zod";

export const envConfigZodSchema = z.object({
  CLIENT_ORIGIN: z.string(),
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .default("development"),
  MONGO_URI: z
    .string()
    .startsWith("mongodb", "Mongodb url should start with mongodb:"),
  MONGO_TEST_URI: z.string().optional(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  JWT_SECRET: z
    .string()
    .min(8, "JWT_SECRET needs to be at minimum 8 characters"),
  UPSTASH_REDIS_REST_URL: z.string().min(1, "UPSTASH REST url is required"),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "UPSTASH REST token is required"),
  RECAPTCHA_SECRET_KEY: z.string().min(1, "RECAPTCHA_SECRET_KEY is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GMAIL_APP_PASSWORD: z
    .string()
    .min(
      19,
      "GMAIL APP PASSWORD must be at least 19 characters (including spaces)",
    ),
  GMAIL_EMAIL: z.string().email("GMAIL_EMAIL must be a valid email address"),
});
