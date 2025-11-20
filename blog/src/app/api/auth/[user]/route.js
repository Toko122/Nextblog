import { NextResponse } from 'next/server';
import User from '../../../../models/user'
import connectDb from '@/lib/config';

export async function GET(req, {params}) {
    try{
       await connectDb()
       const {user} = await params
       const userData = await User.findById(user)
       return NextResponse.json({message: "user get successfully", user: userData}, {status: 200})
    }catch(err){
        console.error('Login error:', err);
            return NextResponse.json(
            { message: 'error in login', error: err.message },
            { status: 500 }
        ); 
    }
}