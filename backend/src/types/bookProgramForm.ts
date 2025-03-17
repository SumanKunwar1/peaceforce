import { IUserInput } from "@typeInterface";
import { Types } from "mongoose";

export interface IBookProgramFormInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  programId: Types.ObjectId;
  participants: number;
  specialRequirements?: string;
}

export interface IBookProgramFormUpdate {
  participants?: number;
  specialRequirements?: string;
}
