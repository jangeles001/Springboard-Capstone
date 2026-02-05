import nodemailer from "nodemailer";
import { getEnv } from "./envConfig";

export const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: getEnv("MAILJET_API_KEY"),
    pass: getEnv("MAILJET_SECRET_KEY"),
  },
});