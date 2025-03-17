import { IUserInput } from "@typeInterface";

export interface IDonationInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  amount: number;
  screenshot: string;
}
