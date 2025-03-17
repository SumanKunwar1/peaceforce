export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  address: string;
  page: string;
  pageTitle: string;
  coverLetter: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface IContactInput {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  page: string;
  pageTitle: string;
}

export interface IContactData extends IContactInput {
  _id: string;
  userId: IUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
