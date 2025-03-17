export interface Tour {
  id: string;
  title: string;
  location: string;
  duration: string;
  days: number;
  image: File | string | null;
  startDate: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  activities: string[];
  inclusions: string[];
  description: string;
  highlights: string[];
  itinerary: Array<{
    day: number;
    description: string;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface BookingFormData {
  name: string; // Changed from fullName
  email: string;
  phoneNumber: string; // Changed from phone
  participants: number;
  specialRequests?: string;
  page: string; // Added
  pageTitle: string; // Added
  tourId: string; // Added
}
