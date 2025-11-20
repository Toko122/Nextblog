import connectDb from "@/lib/config";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDb();
  try {
    const {userId} = await params
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ imageUrl: user.imageUrl || null });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error fetching image" }, { status: 500 });
  }
}

