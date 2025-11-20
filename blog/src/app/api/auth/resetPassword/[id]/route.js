import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function PUT(req, {params}) {
      try{
        const {id} = await params
        const {password} = await req.json()

        if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

      const user = await User.findOne({
         resetToken: id,
         resetTokenExpire: {$gt: Date.now()}
      })

      if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

      const hashedPassword = await bcrypt.hash(password, 10)
       user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save()

      return NextResponse.json({ message: "Password reset successfully" });

      }catch(err){
        return NextResponse.json({message: 'error reseting password'}, {status: 500})
      }
}