import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./index";

export interface IContactData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId?: Types.ObjectId | IUser;
  message?: string;
}

const ContactSchema: Schema<IContactData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContactSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Contact: Model<IContactData> = mongoose.model<IContactData>(
  "Contact",
  ContactSchema
);
