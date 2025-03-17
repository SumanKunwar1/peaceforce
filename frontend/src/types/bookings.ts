// types/bookings.ts
import { IUser } from "./donation";

export interface IBookingData {
  _id?: string | undefined; // Optional, as it may not exist for new bookings
  id?: string | undefined; // Optional, as it may not exist for new bookings
  userId?: IUser; // Optional, as it may not exist for new bookings
  name: string; // Added
  email: string; // Added
  phoneNumber: string; // Added
  participants: number;
  specialRequests?: string;
  tourId: string; // Ensure this is included
  page?: string; // Added
  pageTitle?: string; // Added
  createdAt?: string;
}

export interface IBookingInput {
  name: string; // Added
  email: string; // Added
  phoneNumber: string; // Added
  participants: number;
  specialRequests?: string;
  tourId: string; // Ensure this is included
  page?: string; // Added
  pageTitle?: string; // Added
}

export interface IBookingUpdate {
  name?: string; // Added
  email?: string; // Added
  phoneNumber?: string; // Added
  participants?: number;
  specialRequests?: string;
  tourId?: string; // Ensure this is included
  page?: string; // Added
  pageTitle?: string; // Added
}
