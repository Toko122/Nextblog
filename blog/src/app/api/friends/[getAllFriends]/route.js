import connectDb from "@/lib/config";
import FriendRequest from "@/models/friends";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const currentUserId = req.headers.get("currentuserid")


    const userData = await User.findById(userId).populate(
      "friends",
      "username imageUrl"
    );

    const incomingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "username imageUrl");

    return NextResponse.json(
      {
        message: "Friends fetched successfully",
        friends: userData.friends,
        requests: incomingRequests,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error getting friends",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
