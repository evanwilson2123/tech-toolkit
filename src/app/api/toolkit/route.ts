import { NextRequest, NextResponse } from "next/server";
import Toolkit from "@/models/toolKit";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json(
      { error: "Must include toolkit name" },
      { status: 404 }
    );
  }
  try {
    console.log(name);
    await connectDB();
    const toolkit = new Toolkit({
      name: name,
    });
    await toolkit.save();
    return NextResponse.json(
      { message: "toolkit saved succesfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
