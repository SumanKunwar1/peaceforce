export interface ITicketTypeInput {
  type: "VVIP" | "VIP" | "Regular";
  price: number;
  benefits?: string[]; // optional
  available: number;
}

export interface IEventInput {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  date?: string;
  time?: string;
  image?: string;
  location?: string;
  venue?: string;
  artist?: string;
  ticketTypes?: ITicketTypeInput[]; // Array of TicketTypeInput objects
  gallery?: string[]; // Array of image URLs or paths
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
