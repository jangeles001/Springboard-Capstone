import { createClient } from "redis";
import { getEnv } from "./envConfig.js";

const redisClient = createClient({
  url: getEnv("REDIS_URL") || "redis://localhost:6379", // REDIS_URL the client with try to connect to
});

redisClient.on("error", (err) => console.error("Redis Client Error", err)); // Catches redisClient errors

await redisClient.connect(); // Attempts to connect to redisClient

export default redisClient;
