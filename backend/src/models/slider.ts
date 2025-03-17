import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface Slider extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  description: string;
  image: string;
  buttons: Array<{
    text: string;
    link: string;
    bgColor: string;
  }>;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SliderSchema: Schema<Slider> = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    buttons: [
      {
        text: { type: String, default: "" },
        link: { type: String, default: "" },
        bgColor: { type: String, default: "" },
      },
    ],
    isVisible: { type: Boolean, default: true }, // Default value set to true
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual ID field for easier access
SliderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Exporting the Slider model
export const Slider: Model<Slider> = mongoose.model<Slider>(
  "Slider",
  SliderSchema
);
