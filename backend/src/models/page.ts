import mongoose, { Schema, Document, Model, Types, Mongoose } from "mongoose";

export interface IPageData extends Document {
  id: string;
  _id: Types.ObjectId;
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  lastUpdated: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema<IPageData> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      enum: ["header", "footer"],
      required: true,
    },
    parentPage: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      deafult: "draft",
    },
    metaTitle: {
      type: String,
      required: false,
    },
    metaKeywords: {
      type: String,
      required: false,
    },
    metaDescription: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, toJson: { virtuals: true }, toObject: { virtuals: true } }
);

PageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

PageSchema.virtual("lastUpdated").get(function () {
  return this.updatedAt.toDateString;
});

export const Page: Model<IPageData> = mongoose.model<IPageData>(
  "Page",
  PageSchema
);
