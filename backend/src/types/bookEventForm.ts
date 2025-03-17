import { IUserInput } from "@typeInterface";
import { Types } from "mongoose";

export interface IBookEventFormInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  eventId: Types.ObjectId;
  ticketType: "VVIP" | "VIP" | "Regular";
  quantity: number;
  specialRequirements?: string;
}

export interface IBookEventFormUpdate {
  quantity?: number;
  specialRequirements?: string;
}
