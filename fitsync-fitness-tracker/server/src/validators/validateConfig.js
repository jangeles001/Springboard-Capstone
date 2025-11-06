import dotenv from "dotenv";
import { envConfigZodSchema } from "../schemas/envConfigZodSchema.js";

dotenv.config( { path: "../.env" });

const parsedEnv = envConfigZodSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.format());
  process.exit(1); // Stops app
}

const env = parsedEnv.data;

export function getEnv(key) {
  return env[key];
}
