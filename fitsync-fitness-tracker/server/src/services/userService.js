import * as userRepo from "../repositories/userRepo.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redisClient.js";
import { generateSalt, hashPassword, verifyPassword } from "../utils/hash.js";
import { makePublicId } from "../utils/publicIds.js";
import { getEnv } from "../config/envConfig.js";

export async function registerNewUser(userData) {
  // Checks if a user has already registered with the provided email
  const user = await userRepo.findOneUserByEmail(userData.email);
  if (user) throw new Error("EMAIL_ALREADY_REGISTERED");

  // Password Encryption
  const salt = await generateSalt();
  const passwordHash = await hashPassword(userData.password, salt);
  const newUserUUID = uuidv4(); // creates newUsers uuid
  const publicId = makePublicId(newUserUUID); // calls util function to create short public uuid for the newUser

  delete userData.password; // Removes the unhashed password from the userData object
  userData = { ...userData, uuid: newUserUUID, publicId, passwordHash }; // Combines all the required userData for the newUser document

  // Creates new User document with the userData object
  const newUser = await userRepo.createNewUser(userData);

  const { accessToken, refreshToken } = await generateTokens(newUser);

  return {
    username: newUser.username,
    publicId: newUser.publicId,
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

  const { accessToken, refreshToken } = await generateTokens(user);  

  return {
    username: user.username,
    publicId: user.publicId,
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(refreshToken) {
  // Checks if refresh token is blacklisted
  const revoked = await redisClient.exists(`revoked:${refreshToken}`);
  if (revoked) throw new Error("UNAUTHORIZED");

  // Checks if refresh token is valid
  const stored = await redisClient.get(`refreshToken:${refreshToken}`);
  if (!stored) throw new Error("UNAUTHORIZED");

  // Checks if the refreshToken has expired
  const { userUUID, iat } = JSON.parse(stored);
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeElapsed = now - iat;
  if (timeElapsed > sevenDaysInMs) throw new Error("UNAUTHORIZED");

  await revokeRefreshToken(refreshToken); // Revokes refreshToken

  // Gets user information from database **[Think about adding username to redis cache to avoid having to query db]**
  const user = await userRepo.findOneUserByUUID(userUUID);

  const tokens = await generateTokens(user);
  const newAccessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;

  return { newAccessToken, newRefreshToken };
}

export async function generateTokens(user){
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

  return { accessToken,  refreshToken }
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
