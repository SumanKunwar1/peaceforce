export interface TicketType {
  type: "VVIP" | "VIP" | "Regular";
  price: number;
  benefits: string[];
  available: number;
}

export interface Event {
  _id?: string;
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  time: string;
  image: string | File;
  location: string;
  venue: string;
  artist?: string;
  ticketTypes: TicketType[];
  gallery: (string | File)[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface EventRegistrationData {
  name: string;
  email: string;
  phoneNumber: string;
  page: string;
  pageTitle: string;
  eventId: string;
  ticketType: "VVIP" | "VIP" | "Regular";
  quantity: number;
  specialRequirements?: string;
}

export interface BookEventFormUpdate {
  quantity?: number;
  specialRequirements?: string;
}
