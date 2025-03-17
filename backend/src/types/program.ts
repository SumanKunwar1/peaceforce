export interface IProgramInput {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  venue?: string;
  location?: string;
  capacity?: number;
  instructor?: string;
  schedule?: string;
  requirements?: string[];
  image: string;
  gallery?: string[];
  programGoals?: string[];
  ticketTypes?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
