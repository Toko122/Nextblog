import bcrypt from "bcryptjs";
import User from "../../../../models/user";
import connectDb from "@/lib/config";
import { NextResponse } from "next/server";

const getAllowedOrigin = (req) => {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_VERCEL_URL

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const requestOrigin = req.headers.get("origin");
  if (requestOrigin) {
    return requestOrigin;
  }

  return "*";
};

export function OPTIONS(req) {
  const origin = getAllowedOrigin(req);

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req){
    const origin = getAllowedOrigin(req)

    try {
        await connectDb()
        const {email, phone, password, username} = await req.json()
        
        if (!email || !phone || !password || !username) {
            return NextResponse.json(
                {message: 'All fields are required'}, 
                {
                  status: 400,
                  headers: {
                    "Access-Control-Allow-Origin": origin
                  }
                }
            )
        }

     if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400, headers: { "Access-Control-Allow-Origin": origin } });
    }


        const existedUser = await User.findOne({
            $or: [{email}, {phone}, {username}]
        })
         if (existedUser) {
      let msg = "User already exists";
      if (existedUser.email === email) msg = "Email already exists";
      else if (existedUser.username === username) msg = "Username already exists";
      else if (existedUser.phone === phone) msg = "Phone already exists";

      return NextResponse.json({ message: msg }, { status: 409, headers: { "Access-Control-Allow-Origin": origin } });
    }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email, phone, username, password: hashedPassword
        })


        const userResponse = {
            _id: user._id,
            email: user.email,
            phone: user.phone,
            username: user.username,
            role: user.role
        }

        return NextResponse.json(
            {message: 'user registered', user: userResponse}, 
            {
              status: 200,
              headers: {
                "Access-Control-Allow-Origin": origin
              }
            }
        )

    } catch(err) {
        console.error('Signup error:', err)
        return NextResponse.json(
            {message: 'error register user', error: err.message}, 
            {
              status: 500,
              headers: {
                "Access-Control-Allow-Origin": origin
              }
            }
        )
    }
}

