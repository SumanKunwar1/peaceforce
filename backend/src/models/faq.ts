import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFAQ extends Document {
  _id: Types.ObjectId;
  id: string;
  question: string;
  answer: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema<IFAQ> = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

FAQSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const FAQ: Model<IFAQ> = mongoose.model<IFAQ>("FAQ", FAQSchema);
