import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  clerkId: string;
  email: string;
  toolkits?: mongoose.Types.ObjectId[];
  lastOn?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  clerkId: { type: String, required: true },
  email: { type: String, required: true },
  toolkits: [{ type: mongoose.Types.ObjectId, ref: "Toolkit" }],
  lastOn: { type: mongoose.Types.ObjectId, ref: "Toolkit", required: false },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
