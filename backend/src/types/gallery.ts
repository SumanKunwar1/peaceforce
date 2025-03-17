export interface IGalleryEventInput {
  title?: string;
  description?: string;
  date?: Date;
  coverImage?: string;
  images?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface IGalleryCategoryInput {
  name: string;
  events?: IGalleryEventInput;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface IGalleryEventUpdate {
  events: IGalleryEventInput;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
