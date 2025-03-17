import { IUserInput } from "@typeInterface";
import { Types } from "mongoose";

export interface IBookMembershipInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  membershipId: Types.ObjectId;
  amount: number;
  image: string;
  paymentScreenshot: string;
  paymentMethod: "bank" | "esewa" | "khalti";
  mailingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

export interface IBookMembershipUpdate {
  membershipId?: Types.ObjectId;
  amount?: number;
  image?: string;
  paymentScreenshot?: string;
  paymentMethod?: "bank" | "esewa" | "khalti";
  mailingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}
