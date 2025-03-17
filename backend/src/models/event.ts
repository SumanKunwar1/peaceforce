import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITicketType {
  type: "VVIP" | "VIP" | "Regular";
  price: number;
  benefits?: string[];
  available: number;
}

export interface IEvent extends Document {
  _id: Types.ObjectId;
  id: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  date?: string;
  time?: string;
  image?: string;
  location?: string;
  venue?: string;
  artist?: string;
  ticketTypes?: ITicketType[];
  gallery?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const TicketTypeSchema: Schema<ITicketType> = new mongoose.Schema(
  {
    type: { type: String, enum: ["VVIP", "VIP", "Regular"], required: true },
    price: { type: Number, required: true },
    benefits: { type: [String], required: false },
    available: { type: Number, required: true },
  },
  { _id: false }
);

const EventSchema: Schema<IEvent> = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    image: { type: String, default: "" },
    location: { type: String, default: "" },
    venue: { type: String, default: "" },
    artist: { type: String, default: "" },
    ticketTypes: { type: [TicketTypeSchema], default: [] },
    gallery: { type: [String], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

EventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Event: Model<IEvent> = mongoose.model<IEvent>(
  "Event",
  EventSchema
);
