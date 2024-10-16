import { NextRequest, NextResponse } from "next/server";
import Toolkit from "@/models/toolKit";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/user";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "No auth failed" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json(
      { error: "Must include toolkit name" },
      { status: 404 }
    );
  }
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }
    console.log(name);
    const toolkit = new Toolkit({
      name: name,
    });
    await toolkit.save();
    user.toolkits.push(toolkit._id);
    await user.save();
    return NextResponse.json(
      { message: "toolkit saved succesfully", toolkits: toolkit },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Auth failure" }, { status: 400 });
  }
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    console.log("User found:", user);

    const toolkits = await Toolkit.find({ _id: { $in: user.toolkits } });
    console.log("Fetched toolkits:", toolkits);

    if (toolkits.length === 0) {
      return NextResponse.json({ error: "No toolkits found" });
    }

    return NextResponse.json(
      { toolkits: toolkits, lastOn: user.lastOn },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Auth failure" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await connectDB();
    // Delete the toolkit from the database
    await Toolkit.deleteOne({ _id: id });

    // Find the user based on their clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // Remove the toolkit ID from the user's toolkits array
    user.toolkits = user.toolkits.filter(
      (toolkitId: string) => toolkitId !== id
    );

    // Save the updated user
    await user.save();

    return NextResponse.json({ message: "Toolkit deleted" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
