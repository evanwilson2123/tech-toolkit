import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import Toolkit from "@/models/toolKit";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const { link, toolkitId } = await req.json();
  console.log(link, toolkitId);
  if (!userId) {
    return NextResponse.json({ error: "auth failed" }, { status: 400 });
  }
  if (!link || !toolkitId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    await connectDB();
    const toolkit = await Toolkit.findOne({ _id: toolkitId });
    if (!toolkit) {
      return NextResponse.json({ error: "No toolkit found" }, { status: 404 });
    }
    toolkit.docLinks.push(link);
    await toolkit.save();
    return NextResponse.json(
      { message: "link added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { link, toolkitId } = await req.json();
  if (!link || !toolkitId) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await connectDB();
    const toolkit = await Toolkit.findOne({ _id: toolkitId });
    if (!toolkit) {
      return NextResponse.json({ error: "toolkit not found" }, { status: 404 });
    }
    toolkit.docLinks = toolkit.docLinks.filter((li: string) => li !== link);
    await toolkit.save();
    return NextResponse.json({ message: "link deleted" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
