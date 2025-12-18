import * as userService from "../services/userService.js";
import { getEnv } from "../config/envConfig.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export const createUser = async (req, res) => {
  try {
    const results = await userService.registerNewUser({ ...req.validatedBody });
    const message = "Registration Successful!";

    // Sets the cookie
    res.cookie("accessToken", results.accessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", results.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.generateSuccessResponse(null, message, 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody; // Pulls out email and password from validatedBody
    const validatedUser = await userService.validateCredentials(
      email,
      password
    );

    const successMessage = `${validatedUser.username} (ID: ${validatedUser.publicId}) Logged In!`;

    res.cookie("accessToken", validatedUser.accessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", validatedUser.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.generateSuccessResponse(null, successMessage, 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getUserController(req, res) {
  try {
    const { username, sub } = req.user; // Pulls out email and password from validatedBody
    const { publicId } = await userService.getPrivateUserInformation(sub);
    return res.generateSuccessResponse({ username, publicId }, "Success!", 200);
  } catch (error) {
    return res.generateSuccessResponse(null, "Success!", 200); // Error is caught but we return success with null data.
  }
}

export async function refreshSessionTokens(req, res) {
  try {
    const { refreshToken } = req.cookies;
    const results = await userService.refreshTokens(refreshToken);

    res.cookie("accessToken", results.newAccessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", results.newRefreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.status(201).json({ message: "TOKENS_REFRESHED" });
  } catch (error) {
    // Checks if refresh token was invalid and deletes session and cookies
    if (error instanceof UnauthorizedError) {
      // Creates new promise so that the the function can await for the session destruction
      await new Promise((resolve) => {
        req.session.destroy((destroyError) => {
          if (destroyError) {
            console.error("SESSION_DESTROY_FAILED:", destroyError);
          }
          resolve();
        });
      });

      // Clears cookies
      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("accessToken", { path: "/" });

      return res.generateErrorResponse(error.message, error.statusCode);
    }
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return res.status(200).json({ message: `Log Out Successful!` });

    await userService.revokeRefreshToken(refreshToken);

    // Creates new promise so that the the function can wait for the session destruction
    await new Promise((resolve) => {
      req.session.destroy((destroyError) => {
        if (destroyError) {
          console.error("Session destroy failed:", destroyError);
        }
        resolve();
      });
    });

    // Clears cookies
    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });

    return res.generateSuccessResponse(null, "Log Out Successful!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}
