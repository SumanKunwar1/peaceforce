import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMembership extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  duration: string;
  fee: number;
  benefits: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema: Schema<IMembership> = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MembershipSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Membership: Model<IMembership> = mongoose.model<IMembership>(
  "Membership",
  MembershipSchema
);
