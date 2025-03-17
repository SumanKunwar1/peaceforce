import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "@models";

export interface IBookMembership extends Document {
  _id: Types.ObjectId;
  id: string;
  userId?: Types.ObjectId | IUser;
  image?: string;
  mailingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  membershipId: Types.ObjectId;
  amount: number;
  paymentMethod: "bank" | "esewa" | "khalti";
  paymentScreenshot: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookMembershipSchema: Schema<IBookMembership> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    mailingAddress: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["bank", "esewa", "khalti"],
      required: true,
    },
    paymentScreenshot: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual ID to return the ObjectId as a string
BookMembershipSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Create the BookMembership model
export const BookMembership: Model<IBookMembership> =
  mongoose.model<IBookMembership>("BookMembership", BookMembershipSchema);
