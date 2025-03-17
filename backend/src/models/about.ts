import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAboutContent extends Document {
  title: string;
  description: string;
  icon: string;
}

export interface IAboutHeroContent extends Document {
  title: string;
  description: string;
}

export interface IAbout extends Document {
  _id: Types.ObjectId;
  id: string;
  aboutHero: IAboutHeroContent; // No icon for aboutHero
  aboutContent: IAboutContent[];
  missionsSection: IAboutContent[];
  servicesSection: IAboutContent[];
  visionSection: IAboutContent[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for AboutContent (with icon)
const AboutContentSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

// Schema for AboutHeroContent (without icon)
const AboutHeroContentSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const AboutSchema: Schema<IAbout> = new mongoose.Schema(
  {
    image: { type: String },
    aboutHero: { type: AboutHeroContentSchema, default: {} },
    aboutContent: { type: [AboutContentSchema], default: [] },
    missionsSection: { type: [AboutContentSchema], default: [] },
    servicesSection: { type: [AboutContentSchema], default: [] },
    visionSection: { type: [AboutContentSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AboutSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const About: Model<IAbout> = mongoose.model<IAbout>(
  "About",
  AboutSchema
);
