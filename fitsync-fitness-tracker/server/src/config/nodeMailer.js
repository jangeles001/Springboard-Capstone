import nodemailer from "nodemailer";
import Mailjet from "node-mailjet";
import { getEnv } from "./envConfig.js";


export const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: getEnv("MAILJET_API_KEY"),
    pass: getEnv("MAILJET_SECRET_KEY"),
  },
});

export const mailjet = Mailjet.apiConnect(
  getEnv("MAILJET_API_KEY"),
  getEnv("MAILJET_SECRET_KEY")
);

console.log("Email services configured");