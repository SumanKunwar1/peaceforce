export interface ITourInput {
  location?: string;
  title?: string;
  duration?: string;
  days?: number;
  image?: string;
  startDate?: string;
  status?: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  activities?: string[];
  inclusions?: string[];
  description?: string;
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    description: string;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
