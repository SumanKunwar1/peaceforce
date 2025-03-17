export interface IFaqInput {
  question: string;
  answer: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface IFaqUpdate {
  question?: string;
  answer?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
