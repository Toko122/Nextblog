import Post from "@/models/post"
import connectDb from "@/lib/config"
import { NextResponse } from "next/server"

export async function GET(req, {params}){
     try{
      await connectDb()
        const {userProfile} = params
        const posts = await Post.find({userProfile}).sort({createdAt: -1})
        return NextResponse.json({posts}, {status: 200})
     }catch(err){
         console.error('Error getting post', err);
            return NextResponse.json(
            { message: 'Error getting post', error: err.message },
            { status: 500 }
         );
     }
}