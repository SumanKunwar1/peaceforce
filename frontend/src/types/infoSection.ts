export interface IInfoSectionData {
  _id: string;
  id: string;
  location: string;
  phoneNumber: string;
  email: string;
  socialLinks: {
    instagram: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IInfoSectionInput {
  location?: string;
  phoneNumber?: string;
  email?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}
