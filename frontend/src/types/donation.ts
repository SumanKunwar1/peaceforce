export interface IUser {
  _id: string | undefined;
  name: string;
  email: string;
  phoneNumber: string;
  page?: string;
  pageTitle?: string;
}

export interface IDonationData {
  _id: string;
  id: string;
  userId: IUser;
  amount: number;
  screenshot: string;
  createdAt: string;
}

export interface IDonationInput {
  name: string;
  email: string;
  phoneNumber: string;
  amount: number;
  paymentMethod: string;
  screenshot?: File;
  page?: string;
  pageTitle?: string;
  role?: string;
}

export interface SupportWay {
  icon: string;
  title: string;
  description: string;
  fullDescription: string;
  benefits: string[];
}
