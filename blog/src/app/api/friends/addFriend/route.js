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
