import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProgram extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  time: string;
  venue: string;
  location: string;
  capacity: number;
  instructor: string;
  schedule: string;
  requirements?: string[];
  image?: string;
  gallery: string[];
  programGoals: string[];
  ticketTypes?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const ProgramSchema: Schema<IProgram> = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    time: { type: String, default: "" },
    venue: { type: String, default: "" },
    location: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
    instructor: { type: String, default: "" },
    schedule: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    programGoals: { type: [String], default: [] },
    ticketTypes: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProgramSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Program: Model<IProgram> = mongoose.model<IProgram>(
  "Program",
  ProgramSchema
);
