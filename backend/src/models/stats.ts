import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStats extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  icon: string;
  endValue: number;
  label: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatsSchema: Schema<IStats> = new mongoose.Schema(
  {
    icon: { type: String, default: "" },
    endValue: { type: Number, default: 0 },
    label: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

StatsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Stats: Model<IStats> = mongoose.model<IStats>(
  "Facts",
  StatsSchema
);
