import * as userRepo from "../repositories/userRepo.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redisClient.js";
import { generateSalt, hashPassword, verifyPassword } from "../utils/hash.js";
import { getEnv } from "../config/envConfig.js";

export async function registerNewUser(userData) {
  // Checks if a user has already registered with the provided email
  const user = await userRepo.findOneUserByEmail(userData.email);
  if (user) throw new Error("EMAIL_ALREADY_REGISTERED");

  // Password Encryption
  const salt = await generateSalt();
  const passwordHash = await hashPassword(userData.password, salt);

  delete userData.password; // Removes the unhashed password from the userData object
  userData = { ...userData, passwordHash }; // Adds the hashed password to the userData object

  // Creates new User document with the userData object
  const newUser = await userRepo.createNewUser(userData);

  // Creates JWT payload and both the access token signed with server JWT_SECRET and refresh token.
  // Access token will expire in 15 min.
  const accessTokenPayload = {
    sub: newUser.uuid.toString(),
    username: newUser.username,
  };
  const accessToken = jwt.sign(accessTokenPayload, getEnv("JWT_SECRET"), {
    expiresIn: "15m",
  });
  const refreshToken = uuidv4(); // Opaque string

  // Sets redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${refreshToken}`,
    604800,
    JSON.stringify({
      userUUID: newUser.uuid,
      iat: Date.now(),
    })
  );

  return {
    username: newUser.username,
    uuid: newUser.uuid,
    accessToken,
    refreshToken,
  };
}

export async function validateCredentials(email, password) {
  // Checks if user email has been registered
  const user = await userRepo.findOneUserByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  // Verifies password is correct
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  // Creates JWT payload and both the access token signed with server JWT_SECRET and refresh token.
  // Access token will expire in 15 min.
  const accessTokenPayload = {
    sub: user.uuid.toString(),
    username: user.username,
  };
  const accessToken = jwt.sign(accessTokenPayload, getEnv("JWT_SECRET"), {
    expiresIn: "15m",
  });
  const refreshToken = uuidv4(); // Opaque string

  // Sets redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${refreshToken}`,
    604800,
    JSON.stringify({
      userUUID: user.uuid,
      iat: Date.now(),
    })
  );

  return {
    username: user.username,
    uuid: user.uuid,
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(providedUserUUID, refreshToken) {
  // Checks if refresh token is blacklisted
  const revoked = await redisClient.exists(`revoked:${refreshToken}`);
  if (revoked) throw new Error("INVALID_REFRESH_TOKEN");

  // Checks if refresh token is valid
  const stored = await redisClient.get(`refreshToken:${refreshToken}`);
  if (!stored) throw new Error("INVALID_REFRESH_TOKEN");

  // Verifies if the token belongs to the user requesting a token refresh
  const { userUUID, iat } = JSON.parse(stored);
  if (!providedUserUUID || providedUserUUID !== userUUID)
    throw new Error("INVALID_REFRESH_TOKEN");

  // Checks if the refreshToken has expired
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeElapsed = now - iat;
  const timeRemaining = sevenDaysInMs - timeElapsed;
  if (timeElapsed > sevenDaysInMs) throw new Error("INVALID_REFRESH_TOKEN");

  // Adds old refreshToken to the revoked list with remaining lifespan
  await redisClient.setEx(
    `revoked:${refreshToken}`,
    Math.floor(timeRemaining / 1000),
    "revoked"
  );

  await redisClient.del(`refreshToken:${refreshToken}`); // Deletes `refreshToken:${refreshToken}` key after token has been revoked

  // Gets user information from database **[Think about adding username to redis cache to avoid havin got query db]**
  const user = await userRepo.findOneUserByUUID(userUUID);

  // Creates new JWT payload and both the new accessToken signed with server JWT_SECRET and refresh token.
  // Access token will expire in 15 min.
  const accessTokenPayload = {
    sub: user.uuid.toString(),
    username: user.username,
  };
  const newAccessToken = jwt.sign(accessTokenPayload, getEnv("JWT_SECRET"), {
    expiresIn: "15m",
  });
  const newRefreshToken = uuidv4(); // Opaque string

  // Updates redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${newRefreshToken}`,
    604800,
    JSON.stringify({
      userUUID: user.uuid,
      iat: Date.now(),
    })
  );

  return { newAccessToken, newRefreshToken };
}

export async function revokeRefreshToken(refreshToken) {
  const stored = await redisClient.get(`refreshToken:${refreshToken}`);
  if (!stored) return; // returns if redis client has already expired the token entry

  const { iat } = JSON.parse(stored);
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeElapsed = now - iat;
  const timeRemaining = sevenDaysInMs - timeElapsed;

  // Sets new `revoked:${refreshToken}` key with remaining lifetime in cache
  if (timeRemaining > 0) {
    await redisClient.setEx(
      `revoked:${refreshToken}`,
      Math.floor(timeRemaining / 1000),
      "revoked"
    );

    await redisClient.del(`refreshToken:${refreshToken}`); // Deletes entry after token has been revoked

    return;
  }
}
