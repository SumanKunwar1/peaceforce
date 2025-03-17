import { IUserInput } from "@typeInterface";

export interface IContactInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  message?: string;
}
