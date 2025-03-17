import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITour extends Document {
  _id: Types.ObjectId;
  id: string | number;
  location?: string;
  title?: string;
  duration?: string;
  days?: number;
  image?: string;
  startDate?: string;
  status?: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  activities?: string[];
  inclusions?: string[];
  description?: string;
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    description: string;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema: Schema<ITour> = new mongoose.Schema(
  {
    location: { type: String, default: "" },
    title: { type: String, default: "" },
    duration: { type: String, default: "" },
    days: { type: Number, default: 0 },
    image: { type: String, default: "" },
    startDate: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    activities: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    itinerary: {
      type: [
        {
          day: { type: Number, default: 0 },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TourSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Tour: Model<ITour> = mongoose.model<ITour>("Tour", TourSchema);
