export interface IProgram {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  time: string;
  venue: string;
  location: string;
  capacity: number;
  instructor: string;
  schedule: string;
  requirements: string[];
  image: File | string | null;
  gallery: string[];
  programGoals: string[];
  ticketTypes: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface ProgramRegistrationData {
  name: string;
  email: string;
  phoneNumber: string;
  page: string;
  pageTitle: string;
  programId: string;
  participants: number;
  specialRequirements?: string;
}
