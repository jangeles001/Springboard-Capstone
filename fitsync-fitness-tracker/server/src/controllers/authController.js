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
      sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", results.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.generateSuccessResponse(null, message, 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
};

export async function verifyController(req, res) {
  try {
    const { token } = req.params;
    await userService.verifyUserAccount(token);
    res.generateSuccessResponse(null, `User Verification Successful`, 200);
  } catch (error) {
    res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody; // Pulls out email and password from validatedBody
    const validatedUser = await userService.validateCredentials(
      email,
      password,
    );

    res.cookie("accessToken", validatedUser.accessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", validatedUser.refreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.generateSuccessResponse(null, "Logged In", 200);
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
    // Error is caught but we return success with null data.
    // This is to prevent malicious actors from being able to determine if a user exists based on the error message.
    return res.generateSuccessResponse(null, "Success!", 200);
  }
}

export async function initiateResetPasswordController(req, res) {
  try {
    const { email } = req.validatedBody;
    await userService.initiatePasswordReset(email);
    return res.generateSuccessResponse(
      null,
      "Please check your email for further instructions.",
      200,
    );
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.validatedBody;
    await userService.resetPassword(token, password);
    return res.generateSuccessResponse(null, "Password Reset Successful!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function refreshSessionTokens(req, res) {
  try {
    const { refreshToken } = req.cookies;
    const results = await userService.refreshTokens(refreshToken);

    res.cookie("accessToken", results.newAccessToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min lifetime
    });

    res.cookie("refreshToken", results.newRefreshToken, {
      httpOnly: true, // prevents access via JavaScript
      secure: getEnv("NODE_ENV") === "production", // only HTTPS in prod
      sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
    });

    return res.status(201).json({ message: "TOKENS_REFRESHED" });
  } catch (error) {
    console.log(error);
    // Checks if refresh token was invalid and deletes session and cookies
    if (error instanceof UnauthorizedError) {
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

    // Clears cookies
    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });

    return res.generateSuccessResponse(null, "Log Out Successful!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}
