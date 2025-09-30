import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { JWT_SECRET } from "../database/config.ts";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmailVerification(userId: number, email: string, baseUrl: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  const url = `${baseUrl}/auth/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"Viral Motion" <no-reply@viralmotion.com>',
      to: email,
      subject: "Verify Your Email",
      text: `Click this link to verify your account: ${url}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Email Verification</h2>
          <p>Please click the button below to verify your account:</p>
          <p>
            <a href="${url}" 
               style="display: inline-block; background-color: #4CAF50; color: white; 
                      padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </p>
          <p>If the button doesn’t work, copy and paste this link:</p>
          <p><a href="${url}">${url}</a></p>
        </div>
      `,
    });
  } catch (error: any) {
    console.error("Email send error:", error.message);
  }
}
