import redisClient from "../config/redisClient.js";
import * as userService from "../services/userService.js";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const results = await userService.registerNewUser({ ...req.validatedBody });

    // Sets the cookie
    res.cookie("accessToken", results.token, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", results.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.status(201).json({
      message: "Registration successful!",
      newUserInfo: `Username: ${results.username} (UUID: ${results.uuid})`,
    });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED")
      return res.status(409).json({ error: error.message });
    return res
      .status(500)
      .json({ error: "Database error", error: error.message });
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody; // Pulls out email and password from validatedBody

    const validatedUser = await userService.validateCredentials(
      email,
      password
    );

    res.cookie("accessToken", validatedUser.accessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", validatedUser.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.status(200).json({
      message: `${validatedUser.username} (UUID: ${validatedUser.uuid}) logged in.`,
    });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS")
      return res.status(401).json({ error: error.message });
    return res
      .status(500)
      .json({ error: "Server error", error: error.message });
  }
}

export async function refreshSessionTokens(req, res){
  try{
    const { refreshToken } = req.cookies;
    const results = await userService.refreshTokens(req.user, refreshToken);

    res.cookie("accessToken", results.accessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", results.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.status(200).json("TOKENS_REFRESHED");
  }catch(error){
    // Checks if refresh token was invalid and deletes session and cookies
    if (error.message === "INVALID_REFRESH_TOKEN"){
      // Creates new promise so that the the function can wait for the session destruction
      await new Promise((resolve) => {
        req.session.destroy((destroyError) => {
        if (destroyError) {
          console.error("Session destroy failed:", destroyError);
        }
        resolve();
      })})

      // Clears cookies
      res.clearCookie("connect.sid", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("accessToken", { path: "/" });

      return res.status(401).json({ error: "SESSION_INVALIDATED" });
    }
    return res.status(500).json({ error: error.message });
  }
}

export async function logout(req, res) {
  try
  {
    const { refreshToken, userUUID }  = req.cookies;
    await userService.revokeRefreshToken(userUUID, refreshToken);

    // Creates new promise so that the the function can wait for the session destruction
    await new Promise((resolve) => {
      req.session.destroy((destroyError) => {
        if (destroyError) {
          console.error("Session destroy failed:", destroyError);
        }
        resolve();
    })});

    // Clears cookies
    res.clearCookie("connect.sid", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });

    return res
    .status(200)
    .json({ message: `LOG_OUT_SUCCESSFUL!` });
  }catch(error){
    return res.status(401).json({ error: error.message })
  }
}