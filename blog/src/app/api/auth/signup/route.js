import bcrypt from "bcryptjs";
import User from "../../../../models/user";
import connectDb from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await connectDb()
        const {email, phone, password, username} = await req.json()
        
        if (!email || !phone || !password || !username) {
            return NextResponse.json(
                {message: 'All fields are required'}, 
                {status: 400}
            )
        }

        const existedUser = await User.findOne({
            $or: [{email}, {phone}, {username}]
        })
        
        if(existedUser) {
            return NextResponse.json(
                {message: 'user already exist'}, 
                {status: 409}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email, phone, username, password: hashedPassword
        })

        // Don't send password back
        const userResponse = {
            _id: user._id,
            email: user.email,
            phone: user.phone,
            username: user.username,
            role: user.role
        }

        return NextResponse.json(
            {message: 'user registered', user: userResponse}, 
            {status: 200}
        )

    } catch(err) {
        console.error('Signup error:', err)
        return NextResponse.json(
            {message: 'error register user', error: err.message}, 
            {status: 500}
        )
    }
}

