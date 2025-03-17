import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISupport extends Document {
  _id: Types.ObjectId;
  id: string;
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  impacts: {
    icon: string;
    number: string;
    title: string;
    description: string;
  }[];
  waysToSupport: {
    icon: string;
    title: string;
    description: string;
    fullDescription: string;
    benefits: string[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SupportSchema: Schema<ISupport> = new mongoose.Schema(
  {
    hero: {
      title: { type: String },
      subtitle: { type: String },
      image: { type: String, default: "" },
    },
    impacts: [
      {
        icon: { type: String },
        number: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    waysToSupport: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
        fullDescription: { type: String },
        benefits: { type: [String], default: [] },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

SupportSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Support: Model<ISupport> = mongoose.model<ISupport>(
  "Support",
  SupportSchema
);
