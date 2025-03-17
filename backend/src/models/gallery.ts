import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGalleryEvent extends Document {
  _id: string;
  title: string;
  description: string;
  date: Date;
  coverImage: string;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface IGalleryCategory extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  events: IGalleryEvent[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const GalleryEventSchema: Schema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  date: { type: Date, default: "" },
  coverImage: { type: String, default: "" },
  images: { type: [String], default: [] },
});

const GalleryCategorySchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    events: { type: [GalleryEventSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

GalleryCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const GalleryCategory = mongoose.model<IGalleryCategory>(
  "GalleryCategory",
  GalleryCategorySchema
);
