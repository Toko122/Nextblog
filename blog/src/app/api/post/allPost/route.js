import connectDb from "@/lib/config";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req){
     try{
         await connectDb()
         const posts = await Post.find().sort({createdAt: -1}).populate('userId', 'username imageUrl')
         return NextResponse.json({ posts }, { status: 200 });

     }catch(err){ 
        return NextResponse.json({ message: "Error getting all posts" }, { status: 500 });
     }
}