import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISeoMeta extends Document {
  _id: Types.ObjectId;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  robotsMeta: string;

  ogTitle: string;
  ogDescription: string;
  ogImage: string;

  createdAt: Date;
  updatedAt: Date;
}

const SeoMetaSchema: Schema<ISeoMeta> = new mongoose.Schema(
  {
    pageTitle: { type: String, required: true, unique: true }, // This could be 'About Us', 'Blog Post', etc.
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: "" },
    robotsMeta: { type: String, default: "index, follow" },

    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

SeoMetaSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const SeoMeta: Model<ISeoMeta> = mongoose.model<ISeoMeta>(
  "SeoMeta",
  SeoMetaSchema
);
