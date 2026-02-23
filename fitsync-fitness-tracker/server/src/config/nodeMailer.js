import nodemailer from "nodemailer";
import { getEnv } from "./envConfig.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
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

transporter.verify((error, success) => {
  if (error) {
    console.log("Connection error:", error);
  } else {
    console.log("Server is ready to take messages");
  }
});

transporter.on("idle", () => {
  console.log("Transporter is idle and ready to send more mail");
});
