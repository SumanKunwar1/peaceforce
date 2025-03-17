export interface IGalleryEvent {
  _id?: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  images: string[];
}

export interface IGalleryCategory {
  id: string;
  name: string;
  events?: IGalleryEvent[];
}

export interface IGalleryEventInput {
  title: string;
  description: string;
  date: string;
  coverImage: File | null;
}

export interface IGalleryCategoryInput {
  name: string;
  events?: IGalleryEventInput;
}

export interface IGalleryEventUpdate {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  coverImage?: File | null;
}

export interface IGalleryCategoryUpdate {
  name?: string;
  events?: IGalleryEventUpdate;
}
