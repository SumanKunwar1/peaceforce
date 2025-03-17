import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "@models";

export interface IBookingFormData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId | IUser;
  participants: number;
  specialRequests?: string;
  tourId: Types.ObjectId;
}

const BookingFormSchema: Schema<IBookingFormData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookingFormSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const BookingForm: Model<IBookingFormData> =
  mongoose.model<IBookingFormData>("BookingForm", BookingFormSchema);
