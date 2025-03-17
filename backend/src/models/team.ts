import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITeamData extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: {
    instagram: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const TeamSchema: Schema<ITeamData> = new mongoose.Schema(
  {
    name: {
      type: String,
      deafult: "",
    },
    role: {
      type: String,
      deafult: "",
    },
    image: {
      type: String,
      deafult: "",
    },
    bio: {
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
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to match frontend `id`
TeamSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Create the model
export const Team: Model<ITeamData> = mongoose.model<ITeamData>(
  "Team",
  TeamSchema
);
