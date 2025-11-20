import User from "@/models/user";
import FriendRequest from "@/models/friends";
import { NextResponse } from "next/server";
import connectDb from "@/lib/config";


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

     await User.findByIdAndUpdate(request.sender, {
         $addToSet: {friends: request.recipient}
     })

     await User.findByIdAndUpdate(request.recipient, {
         $addToSet: {friends: request.sender}
     })

      request.status = 'accepted'
      await request.save()

       return NextResponse.json(
      { message: "Friend request accepted successfully" },
      { status: 200 }
    );

      }catch(err){
         return NextResponse.json(
      { message: "Error while accepting", error: err.message },
      { status: 500 }
    );
      }
}