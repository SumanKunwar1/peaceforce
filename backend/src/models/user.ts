import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin" | "jobApplicator" | "volunteer" | "donator"; // Allowing the role to be 'jobApplicator'
  password?: string;
  address?: string;
  page: string;
  pageTitle: string;
  cv: string; // Required CV for job applicators
  coverLetter?: string; // Optional Cover Letter
  jobPostId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "jobApplicator", "volunteer", "donator"], // Added 'jobApplicator' role option
      default: "user",
    },
    password: {
      type: String,
      required: function () {
        return this.role === "admin"; // Password is required only for admin
      },
    },
    address: { type: String, default: "" },
    page: {
      type: String,
      required: function () {
        return this.role !== "admin"; // If not an admin, page is required
      },
      default: "",
    },
    pageTitle: {
      type: String,
      required: function () {
        return this.role !== "admin"; // If not an admin, pageTitle is required
      },
      default: "",
    },
    cv: {
      type: String,
      required: function () {
        return this.role === "jobApplicator"; // CV is required only for jobApplicator role
      },
    },
    coverLetter: {
      type: String,
    },
    jobPostId: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: function () {
        return this.role === "jobApplicator";
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual ID to return the ObjectId as a string
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Hashing password before saving if it's modified
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(this.password!, salt); // Hash the password
    this.password = hashedPassword; // Replace the plain password with the hashed one
  }
  next();
});

// Create the User model
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
