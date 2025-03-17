export interface IBookMembership {
  id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    address: string;
    page: string;
    pageTitle: string;
    coverLetter: string;
  };
  page?: string;
  pageTitle?: string;
  mailingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  membershipId: string;
  amount: number;
  paymentMethod: "bank" | "esewa" | "khalti";
  image?: File | string | null;
  paymentScreenshot?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookMembershipInput {
  name: string;
  email: string;
  phoneNumber: string;
  membershipId: string;
  amount: number;
  paymentMethod: "bank" | "esewa" | "khalti";
  mailingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  page?: string;
  pageTitle?: string;
  image?: File | string | null;
  paymentScreenshot?: File | string | null;
}

export interface IBookMembershipUpdate {
  _id?: string;
  membershipId?: IMembershipTypes;
  amount?: number;
  paymentMethod?: "bank" | "esewa" | "khalti";
  mailingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  image?: File | string | null;
  paymentScreenshot?: File | string | null;
}

export interface IMembershipTypes {
  id: string;
  name: string;
  duration: number | "lifetime";
  fee: number;
  benefits: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
