import connectDb from "@/lib/config";
import User from "@/models/user";
import FriendRequest from "@/models/friends";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { currentUserId, targetUserId } = await req.json();

    if (!currentUserId || !targetUserId) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { message: "Can't add yourself" },
        { status: 400 }
      );
    }

    const existingRequest = await FriendRequest.findOne({
      sender: currentUserId,
      recipient: targetUserId,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "Request already sent" },
        { status: 400 }
      );
    }

    await FriendRequest.create({
      sender: currentUserId,
      recipient: targetUserId,
      status: "pending",
    });

    return NextResponse.json(
      { message: "Friend request sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending request", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
      try{
        await connectDb()
        const { senderId, targetUserId } = await req.json();
        const deleted = await FriendRequest.findOneAndDelete({
            sender: senderId,
            recipient: targetUserId,
            status: 'pending'
        })

          if (!deleted) {
      return NextResponse.json(
        { message: "request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "friend request canceled" },
      { status: 200 }
    );
      }catch(err){
        return NextResponse.json({message: "error canceling friend request"}, {status: 500})
      }
}

export async function GET(req) {
      try{ 
        await connectDb()
        const {searchParams} = new URL(req.url)
        const senderId = searchParams.get('senderId')
        const targetUserId = searchParams.get('targetUserId')
        
        const pending = await FriendRequest.findOne({
            sender: senderId,
            recipient: targetUserId,
            status: 'pending'
        })
        
        return NextResponse.json({ pending: !!pending });

      }catch(err){
        return NextResponse.json({message: 'error geting friend request', error: err.message}, {status: 500});
      }
}