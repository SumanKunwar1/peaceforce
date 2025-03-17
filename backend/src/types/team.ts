export interface ITeamInput {
  name?: string;
  role?: string;
  image?: string;
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
