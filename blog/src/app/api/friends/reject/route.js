import connectDb from "@/lib/config";
import FriendRequest from "@/models/friends";
import { NextResponse } from "next/server";


export async function POST(req) {
      try{
        await connectDb()

         const {requestId, currentUserId} = await req.json()

         const request = await FriendRequest.findById(requestId)

         if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
          }

          if (request.recipient.toString() !== currentUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
          }

          if (request.status !== "pending") {
            return NextResponse.json({ message: "Already processed" }, { status: 400 });
          }      

          request.status = 'rejected'
          await request.save()

          return NextResponse.json(
             { message: "Friend request rejected" },
             { status: 200 }
           );

      }catch(err){
        return NextResponse.json({message: "error rejecting request"}, {status: 500})
      }
}