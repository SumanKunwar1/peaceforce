import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInfoSectionData extends Document {
  _id: Types.ObjectId;
  id: string;
  location: string;
  phoneNumber: string;
  email: string;
  socialLinks: {
    instagram: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

const InfoSectionSchema: Schema<IInfoSectionData> = new mongoose.Schema(
  {
    location: {
      type: String,
      deafult: "",
    },
    email: {
      type: String,
      deafult: "",
    },
    phoneNumber: {
      type: String,
      deafult: "",
    },
    socialLinks: {
      instagram: {
        type: String,
        deafult: "",
      },
      facebook: {
        type: String,
        deafult: "",
      },
      twitter: {
        type: String,
        deafult: "",
      },
      linkedin: {
        type: String,
        deafult: "",
      },
      youtube: {
        type: String,
        deafult: "",
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to match frontend `id`
InfoSectionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Create the model
export const InfoSection: Model<IInfoSectionData> =
  mongoose.model<IInfoSectionData>("InfoSection", InfoSectionSchema);
