import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IJobPost extends Document {
  _id: Types.ObjectId;
  id: string;
  title?: string;
  department?: string;
  location?: string;
  type?: "Full-time" | "Part-time" | "Contract";
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  postedDate?: string;
  deadline?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobPostSchema: Schema<IJobPost> = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    department: { type: String, default: "" },
    location: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      default: "Full-time",
    },
    description: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    postedDate: { type: String, default: Date.now() },
    deadline: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual fields
JobPostSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const JobPost: Model<IJobPost> = mongoose.model<IJobPost>(
  "JobPost",
  JobPostSchema
);
