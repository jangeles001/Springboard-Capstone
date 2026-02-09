import axios from "axios";
import { getEnv } from "../config/envConfig.js";

export async function verifyRecaptcha(req, res, next) {
  // Skips if running a test
  if (getEnv("NODE_ENV") === "test") {
    return next();
  }

  const { reCaptchaToken } = req.body;

  if (!reCaptchaToken) {
    return res.generateErrorResponse("Missing Recaptcha Token!", 401);
  }

  const result = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: getEnv("RECAPTCHA_SECRET_KEY"),
        response: reCaptchaToken,
      },
    },
  );

  if (!result.data.success) {
    return res.generateErrorResponse("Captcha failed", 401);
  }

  next();
}
