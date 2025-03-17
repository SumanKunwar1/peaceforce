import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEnrollmentFormData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId; // Reference to the User model
  preferredLanguage: string;
  message?: string;
  courseId: Types.ObjectId;
}

const EnrollmentFormSchema: Schema<IEnrollmentFormData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    preferredLanguage: { type: String, required: true },
    message: { type: String, default: "" },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "CourseCategory",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

EnrollmentFormSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const EnrollmentForm: Model<IEnrollmentFormData> =
  mongoose.model<IEnrollmentFormData>("EnrollmentForm", EnrollmentFormSchema);
