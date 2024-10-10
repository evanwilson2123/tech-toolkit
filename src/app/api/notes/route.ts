import { connectDB } from "@/lib/db";
import Toolkit from "@/models/toolKit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes, toolkitId } = await req.json();
  if (!notes || !toolkitId) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await connectDB();
    const toolkit = await Toolkit.findOne({ _id: toolkitId });
    if (!toolkit) {
      return NextResponse.json({ error: "No toolkit found" }, { status: 404 });
    }
    toolkit.notes = notes;
    await toolkit.save();
    return NextResponse.json(
      { message: "notes saved succesfully" },
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const toolkitId = searchParams.get("toolkitId");
  if (!toolkitId) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await connectDB();
    const toolKit = await Toolkit.findOne({ _id: toolkitId });
    if (!toolKit) {
      return NextResponse.json({ error: "toolkit not found" }, { status: 404 });
    }
    return NextResponse.json({ notes: toolKit.notes }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
