import User from '../../../../models/user'
import { NextResponse } from 'next/server'
import connectDb from '@/lib/config'

export async function GET(req){
    try{
       await connectDb()
       const users = await User.find().sort({createdAt: -1})
       return NextResponse.json({message: 'users get successfully', users}, {status: 200})
    }catch(err){
      return NextResponse.json({message: "error getting all users"}, {status: 500})
    }
}