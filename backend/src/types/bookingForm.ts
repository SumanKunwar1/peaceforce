import { IUserInput } from "./index";
import { Types } from "mongoose";

export interface IBookingFormInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  tourId: Types.ObjectId;
  participants: number;
  specialRequests?: string;
}

export interface IBookingFormUpdate {
  tourId: Types.ObjectId;
  participants?: number;
  specialRequests?: string;
}
