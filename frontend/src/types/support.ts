export interface ISupport {
  _id?: string;
  id?: string;
  hero: {
    title: string;
    subtitle: string;
    image: File | string;
  };
  impacts: {
    icon: string;
    number: string;
    title: string;
    description: string;
  }[];
  waysToSupport: {
    icon: string;
    title: string;
    description: string;
    fullDescription: string;
    benefits: string[];
  }[];
  support?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface ISupportInput {
  hero?: {
    title?: string;
    subtitle?: string;
    image?: File | string;
  };
  impacts?: {
    icon?: string;
    number?: string;
    title?: string;
    description?: string;
  }[];
  waysToSupport?: {
    icon?: string;
    title?: string;
    description?: string;
    fullDescription?: string;
    benefits?: string[];
  }[];
  support?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}
