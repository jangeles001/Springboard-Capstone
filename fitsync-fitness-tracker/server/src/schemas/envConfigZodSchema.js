import { z } from "zod";

export const envConfigZodSchema = z.object({
  CLIENT_ORIGIN: z.string(),
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .default("development"),
  MONGO_URI: z
    .string()
    .startsWith("mongodb", "Mongodb url should start with mongodb:"),
  MONGO_TEST_URI: z
    .string()
    .startsWith("mongodb", "Mongodb url should start with mongodb:"),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  JWT_SECRET: z
    .string()
    .min(8, "JWT_SECRET needs to be at minimum 8 characters"),
  REDIS_TEST_URL: z
    .string()
    .startsWith("redis", "Redis url should start with redis:"),
  UPSTASH_REDIS_REST_URL: z.string().min(1, "UPSTASH REST url is required"),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "UPSTASH REST token is required"),
  RECAPTCHA_SECRET_KEY: z.string().min(1, "RECAPTCHA_SECRET_KEY is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  MAILJET_API_KEY: z.string().min(1, "MAILJET_API_KEY is required"),
  MAILJET_SECRET_KEY: z.string().min(1, "MAILJET_SECRET_KEY is required"),
  MAILJET_FROM_NAME: z.string().min(1, "MAILJET_FROM_NAME is required"),
  MAILJET_FROM_EMAIL: z
    .string()
    .email("MAILJET_FROM_EMAIL must be a valid email address"),
});
