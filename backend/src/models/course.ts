import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourse extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  image: string;
  description: string;
  duration: string;
  language: string[];
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: string;
  };
  highlights: string[];
  materials: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const CourseSchema: Schema<ICourse> = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  duration: { type: String, default: "" },
  language: { type: [String], default: [] },
  instructor: {
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  highlights: { type: [String], default: [] },
  materials: { type: [String], default: [] },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  metaKeywords: { type: [String], default: [] },
  image: { type: String, default: "" },
});

// Virtual field to get `id`
CourseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Course: Model<ICourse> = mongoose.model<ICourse>(
  "Course",
  CourseSchema
);
