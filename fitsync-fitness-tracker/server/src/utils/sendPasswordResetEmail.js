import { sendEmail } from "../config/nodeMailer.js";
import { getEnv } from "../config/envConfig.js";

export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${getEnv("CLIENT_ORIGIN")}/auth/change-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
