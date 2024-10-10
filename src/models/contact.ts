import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IContact {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  phoneNum?: string;
  email?: string;
}

const contactSchema = new Schema<IContact>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  phoneNum: { type: String, required: false },
  email: { type: String, required: false },
});

// Ensure the model is only compiled once, and reuse it if it's already compiled.
const Contact = models.Contact || model<IContact>("Contact", contactSchema);

export default Contact;
