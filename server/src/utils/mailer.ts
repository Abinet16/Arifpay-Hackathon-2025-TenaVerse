import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"TenaPay Alerts" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    logger.info(`📧 Email sent to ${to}`);
  } catch (err: any) {
    logger.error(`Email failed: ${err.message}`);
  }
}
