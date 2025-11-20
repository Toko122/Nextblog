import { NextResponse } from "next/server";
import User from '../../../../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDb from "@/lib/config";

export async function POST(req) {
    try {
        await connectDb()
        const {email, password} = await req.json()
        const user = await User.findOne({email})
        if(!user) return NextResponse.json({message: 'user not found'}, {status: 409})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return NextResponse.json({message: "invalid email or password"}, {status: 404})

        const token = jwt.sign({id: user._id}, process.env.JWT, {expiresIn: '2d'})

        return NextResponse.json({message: 'login successfully', user, token}, {status: 200})
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json(
            { message: 'error in login', error: err.message },
            { status: 500 }
        );
    }
}
