import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";
import Toolkit from "@/models/toolKit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { TbPoolOff } from "react-icons/tb";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "auth failed" }, { status: 400 });
  }
  const requestBody = await req.json();
  console.log("Request Body:", requestBody); // Log entire body

  // Destructure the request body fields
  const { contact, toolkitId } = requestBody;
  const { firstName, lastName, phoneNum, email } = contact;

  console.log(firstName, lastName, phoneNum, email);
  try {
    await connectDB();
    const newContact = new Contact({
      firstName: firstName,
      lastName: lastName,
      phoneNum: phoneNum,
      email: email,
    });
    await newContact.save();
    const toolkit = await Toolkit.findOne({ _id: toolkitId });
    if (!toolkit) {
      return NextResponse.json({ error: "toolkit not found" }, { status: 404 });
    }
    toolkit.contacts.push(newContact._id);
    await toolkit.save();
    return NextResponse.json({ contact: newContact }, { status: 200 });
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
  const contactIds = searchParams.get("contactIds")?.split(","); // Extract contactIds from query parameters

  if (!contactIds || contactIds.length === 0) {
    return NextResponse.json(
      { error: "No contact IDs provided" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const contacts = await Contact.find({ _id: { $in: contactIds } });

    if (contacts.length === 0) {
      return NextResponse.json({ error: "No contacts found" }, { status: 404 });
    }

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { contactId, toolkitId } = await req.json();
  if (!contactId || !toolkitId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    await connectDB();
    await Contact.deleteOne({ _id: contactId });
    const toolkit = await Toolkit.findOne({ _id: toolkitId });
    if (!toolkit) {
      return NextResponse.json({ error: "toolkit not found" }, { status: 404 });
    }
    toolkit.contacts = toolkit.contacts.filter(
      (contact: string) => contact.toString() !== contactId
    );

    await toolkit.save();
    return NextResponse.json({ message: "contact deleted" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
