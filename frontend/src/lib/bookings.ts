// lib/bookings.ts
import { IBookingData } from "@/types/bookings";

// Assuming you have a function to get the authentication token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem("adminToken"); // Or from context, depending on your setup
};

// Get all booking forms
export const getBookings = async (): Promise<{
  bookingForms: IBookingData[];
}> => {
  const token = getAuthToken();
  const response = await fetch("/api/book-tour", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

// Get a booking form by ID
export const getBookingById = async (
  bookingFormId: string
): Promise<IBookingData> => {
  const token = getAuthToken();
  const response = await fetch(`/api/book-tour/${bookingFormId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch booking form");
  return response.json();
};

// Create a new booking form
export const createBooking = async (
  bookingData: IBookingData
): Promise<IBookingData> => {
  const token = getAuthToken();
  const response = await fetch("/api/book-tour", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create booking form");
  }

  return response.json();
};

// Update a booking form by ID
export const updateBooking = async (
  bookingFormId: string,
  bookingData: IBookingData
): Promise<IBookingData> => {
  const token = getAuthToken();
  const response = await fetch(`/api/book-tour/${bookingFormId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) throw new Error("Failed to update booking form");
  return response.json();
};

// Delete a booking form by ID
export const deleteBooking = async (bookingFormId: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`/api/book-tour/${bookingFormId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete booking form");
};
