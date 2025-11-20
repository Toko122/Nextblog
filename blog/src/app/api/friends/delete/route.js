import connectDb from "@/lib/config";
import FriendRequest from "@/models/friends";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDb();

    const { userId, friendId } = await req.json();

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId)
    await user.save();
    await friend.save()

     await FriendRequest.deleteMany({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId },
      ],
    });

    return NextResponse.json(
      { message: "Friend removed" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error removing friend", error: error.message },
      { status: 500 }
    );
  }
}
