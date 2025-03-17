import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./index";

export interface IDonationData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId?: Types.ObjectId | IUser;
  amount: number;
  screenshot: string;
}

const DonationSchema: Schema<IDonationData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    screenshot: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

DonationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Donation: Model<IDonationData> = mongoose.model<IDonationData>(
  "Donation",
  DonationSchema
);
