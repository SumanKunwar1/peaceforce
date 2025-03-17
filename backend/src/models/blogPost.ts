import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBlogPost extends Document {
  _id: Types.ObjectId;
  id: string;
  isEditable: boolean;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const BlogPostSchema: Schema<IBlogPost> = new mongoose.Schema(
  {
    isEditable: { type: Schema.Types.Mixed, default: true },
    title: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    author: {
      name: { type: String, default: "" },
      avatar: { type: String, default: "" },
      role: { type: String, default: "" },
    },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    readTime: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BlogPostSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BlogPostSchema.virtual("date").get(function () {
  return this.createdAt;
});

export const BlogPost: Model<IBlogPost> = mongoose.model<IBlogPost>(
  "BlogPost",
  BlogPostSchema
);
