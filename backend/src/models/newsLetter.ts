import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INewsLetter extends Document {
  _id: Types.ObjectId;
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsLetterSchema: Schema<INewsLetter> = new mongoose.Schema(
  {
    email: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual ID to return the ObjectId as a string
NewsLetterSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Create the NewsLetter model
export const NewsLetter: Model<INewsLetter> = mongoose.model<INewsLetter>(
  "NewsLetter",
  NewsLetterSchema
);
