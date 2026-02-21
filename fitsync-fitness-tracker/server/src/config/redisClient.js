import { Redis } from "@upstash/redis";
import { getEnv } from "./envConfig.js";

const redisClient = new Redis({
  url: getEnv("UPSTASH_REDIS_REST_URL"),
  token: getEnv("UPSTASH_REDIS_REST_TOKEN"),
});

console.log("REDIS connection established");

export default redisClient;
