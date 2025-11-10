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

  // Creates newUser document with the userData object
  const newUser = await userRepo.createNewUser(userData);

  // Creates JWT payload and both the access token signed with server JWT_SECRET and refresh token.
  // Access token will expire in 15 min.
  const accessPayload = {
    sub: newUser.uuid.toString(),
    username: newUser.username,
  };
  const accessToken = jwt.sign(accessPayload, getEnv("JWT_SECRET"), {
    expiresIn: "15min",
  });
  const refreshToken = uuidv4(); // Opaque string

  // Sets redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${newUser.uuid}`,
    604800,
    JSON.stringify({
      token: refreshToken,
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
    expiresIn: "15min",
  });
  const refreshToken = uuidv4(); // Opaque string

  // Sets redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${user.uuid}`,
    604800,
    JSON.stringify({
      token: refreshToken,
      iat: date.now(),
    })
  );

  return {
    username: user.username,
    uuid: user.uuid,
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(user, refreshToken) {
  // Checks if refresh token is blacklisted
  const revoked = await redisClient.exists(`revoked:${refreshToken}`);
  if (revoked) throw new Error("INVALID_REFRESH_TOKEN");

  // Chekcs if refresh token is valid
  const stored = await redisClient.getEx(`refreshToken:${user.uuid}`);
  if (!stored) throw new Error("INVALID_REFRESH_TOKEN");

  // Checks if the token doesn't match the opaque string stored in cache or has expired
  const { token, iat } = JSON.parse(stored);
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  if (token !== refreshToken || now - iat > sevenDaysInMs)
    throw new Error("INVALID_REFRESH_TOKEN");

  // Creates new JWT payload and both the new accessToken signed with server JWT_SECRET and refresh token.
  // Access token will expire in 15 min.
  const accessTokenPayload = {
    sub: user.uuid,
    username: user.username,
  };
  const newAccessToken = jwt.sign(accessTokenPayload, getEnv("JWT_SECRET"), {
    expiresIn: "15min",
  });
  const newRefreshToken = uuidv4(); // Opaque string

  // Updates redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${newUser.uuid}`,
    604800,
    JSON.stringify({
      token: newRefreshToken,
      iat: date.now(),
    })
  );

  return { newAccessToken, newRefreshToken };
}

export async function revokeRefreshToken(userUUID, refreshToken) {
  const stored = await redisClient.getEx(`refreshToken:${userUUID}`);
  if (!stored) return; // returns if redis client has already expired token entry

  const now = date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeElapsed = now - refreshToken.iat;
  const timeRemaining = sevenDaysInMs - timeElapsed;

  // Sets new `revoked:${refreshToken}` key with remaining lifetime in cache
  if (timeRemaining > 0) {
    await redisClient.setEx(
      `revoked:${refreshToken}`,
      timeRemaining,
      "revoked"
    );

    await redisClient.del(`refreshToken:${userUUID}`); // Deletes entry if token has already expired

    return;
  }
}
