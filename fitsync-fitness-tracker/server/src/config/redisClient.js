import { createClient } from "redis";
import { getEnv } from "./envConfig.js";

const REDIS_URL =
  getEnv("NODE_ENV") === "production"
    ? getEnv("UPSTASH_REDIS_REST_URL")
    : getEnv("REDIS_TEST_URL");

const REDIS_TOKEN =
  getEnv("NODE_ENV") === "production"
    ? getEnv("UPSTASH_REDIS_REST_TOKEN")
    : null;

const redisClient = createClient({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();
console.log("REDIS connection established");

export default redisClient;
