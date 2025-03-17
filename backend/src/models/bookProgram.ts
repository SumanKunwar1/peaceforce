import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "@models";

export interface IBookProgramData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId | IUser;
  programId: Types.ObjectId;
  participants: number;
  specialRequirements?: string;
}

const BookProgramSchema: Schema<IBookProgramData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    participants: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequirements: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookProgramSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const BookProgram: Model<IBookProgramData> =
  mongoose.model<IBookProgramData>("BookProgram", BookProgramSchema);
