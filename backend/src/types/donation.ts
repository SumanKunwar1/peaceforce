import { IUserInput } from "./index";

export interface IDonationInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  amount: number;
  screenshot: string;
}
