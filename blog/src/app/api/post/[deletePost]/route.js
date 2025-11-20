import connectDb from "@/lib/config";
import { getUserIdFromToken } from "@/middleware/getUserIdFromToken";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function DELETE(req, {params}) {
     try{
        await connectDb()

        const authHeader = req.headers.get("authorization")
         if(!authHeader || !authHeader.startsWith('Bearer')){
          throw new Error('Unauthorized')
        }

         const token = authHeader.split(' ')[1]

         const decoded = jwt.verify(token, process.env.JWT)
         decoded.id

        const {deletePost} = await params
        const userId = getUserIdFromToken(req)
        
        const deletedPost = await Post.findOneAndDelete({_id: deletePost, userId})

        return NextResponse.json({ message: "Post deleted", deletedPost }, { status: 200 })

     }catch(err){
        console.error('Error deleting post', err);
            return NextResponse.json(
          { message: 'Error deleting post', error: err.message },
          { status: 500 }
        );
     }
}