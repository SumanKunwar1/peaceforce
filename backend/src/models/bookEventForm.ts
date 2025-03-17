import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./index";

export interface IBookEventData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId | IUser;
  eventId: Types.ObjectId;
  ticketType: "VVIP" | "VIP" | "Regular";
  quantity: number;
  specialRequirements?: string;
}

const BookEventSchema: Schema<IBookEventData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["VVIP", "VIP", "Regular"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequirements: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookEventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const BookEvent: Model<IBookEventData> = mongoose.model<IBookEventData>(
  "BookEvent",
  BookEventSchema
);
