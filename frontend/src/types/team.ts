export interface ITeamData {
  _id: string;
  id: string;
  name: string;
  role: string;
  image: File | string;
  bio: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface ITeamInput {
  name?: string;
  role?: string;
  image?: File | string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
