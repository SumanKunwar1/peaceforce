import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  quote?: string;
  author?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema<ITestimonial> = new mongoose.Schema(
  {
    quote: { type: String, default: "" },
    author: { type: String, default: "" },
    role: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TestimonialSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Testimonial: Model<ITestimonial> = mongoose.model<ITestimonial>(
  "Testimonial",
  TestimonialSchema
);
