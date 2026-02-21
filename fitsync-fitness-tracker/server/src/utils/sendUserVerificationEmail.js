import { sendEmail } from "../config/nodeMailer.js";
import { getEnv } from "../config/envConfig.js";

export async function sendUserVerificationEmail(user, token) {
  const verifyUrl = `${getEnv("CLIENT_ORIGIN")}/auth/verify/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Please Verify Your Account",
    html: `
      <h2>Verify your account!</h2>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}">Verify Account</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
