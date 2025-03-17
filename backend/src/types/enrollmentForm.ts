import { IUserInput } from "./index";
import { Types } from "mongoose";

export interface IEnrollmentFormInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle" | "address"
  > {
  preferredLanguage: string;
  message?: string;
  courseId: Types.ObjectId;
}
export interface IEnrollementUpdate {
  preferredLanguage?: string;
  message?: string;
  courseId?: Types.ObjectId;
}
