import User from "@/models/user";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import connectDb from "@/lib/config";

export async function POST(req) {
     try{
        await connectDb()
        const {email} = await req.json()

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpire  = Date.now() + 1000 * 60 * 15

        const user = await User.findOne({email})
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.resetToken = resetToken,
        user.resetTokenExpire = resetTokenExpire
        await user.save()

        const resetLink = `http://localhost:3000/features/auth/resetPassword/${resetToken}`

        const transporter = nodemailer.createTransport({
             service: 'gmail',
             auth: {
                user: process.env.USER,
                pass: process.env.PASS
             }
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "🔐 Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
      <h2 style="color: #333; text-align: center;">Reset Your Password</h2>

      <p style="font-size: 16px; color: #444;">
        Hello <strong>${email}</strong>,
      </p>

      <p style="font-size: 15px; color: #555;">
        We received a request to reset your password. If you made this request, please click the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          🔁 Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #888;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 40px;">
        &mdash; Your Security Team
      </p>
     </div>`
     }

     await transporter.sendMail(mailOptions)

     return NextResponse.json({ message: "Password reset email sent successfully" });
     }catch(err){
        return NextResponse.json({message: "error sending email"}, {status: 500})
     }
}