import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { envConfigZodSchema } from "../schemas/envConfigZodSchema.js";

const __filename = fileURLToPath(import.meta.url) // Gets file path
const __dirname = path.dirname(__filename,)  // Gets directory name

dotenv.config( { path: path.resolve(__dirname, "../../.env") }); //always resolves file path from server/ root

const parsedEnv = envConfigZodSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.format());
  process.exit(1); // Stops app on error
}

const env = parsedEnv.data;

export function getEnv(key) {
  return env[key];
}
