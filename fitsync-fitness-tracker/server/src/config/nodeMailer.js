import nodemailer from "nodemailer";
import { getEnv } from "./envConfig.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: getEnv("GMAIL_EMAIL"),
    pass: getEnv("GMAIL_APP_PASSWORD"),
  },
});

export async function sendEmail({ to, subject, html }) {
  const env = getEnv("NODE_ENV");

  // Skip if in development environment
  if (["test", "development"].includes(env)) {
    console.log(`[Email skipped in test] → ${to}: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: `"FitSync" <${getEnv("GMAIL_EMAIL")}>`,
    to,
    subject,
    html,
  });
}

console.log("Email services configured");
