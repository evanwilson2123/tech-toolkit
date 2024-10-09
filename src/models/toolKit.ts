import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IToolkit {
  _id: Types.ObjectId;
  name: string;
  quickLinks?: string[];
  docLinks?: string[];
  notes?: string;
  contacts?: Types.ObjectId[];
}

const toolkitSchema = new Schema<IToolkit>({
  name: { type: String, required: true },
  quickLinks: [{ type: String, required: false }],
  docLinks: [{ type: String, required: false }],
  notes: { type: String, required: false },
  contacts: [{ type: mongoose.Types.ObjectId, ref: "Contact" }],
});

const Toolkit = models.Toolkit || model<IToolkit>("Toolkit", toolkitSchema);

export default Toolkit;
