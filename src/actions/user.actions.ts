import User from "@/models/user";
import { connectDB } from "@/lib/db";

export const createUser = async (user: any) => {
  try {
    await connectDB();
    const newUser = new User({
      clerkId: user.id,
      email: user.email,
    });
    await newUser.save();
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
};
