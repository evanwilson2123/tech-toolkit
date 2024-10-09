import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  console.log(id);
  return NextResponse.json({ message: "got it" }, { status: 200 });
}
