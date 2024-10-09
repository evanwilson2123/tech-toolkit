import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Invalid auth" }, { status: 400 });
  }
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  user.lastOn = id;
  await user.save();
  console.log(id);
  return NextResponse.json({ message: "got it" }, { status: 200 });
}
