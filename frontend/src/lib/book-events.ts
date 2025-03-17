import useSWR from "swr";
import axios from "axios";
import type { Event, EventRegistrationData } from "../types/event";

const EVENT_API_URL = "/api/event";
const BOOK_EVENT_API_URL = "/api/book-event";

// Fetcher function for SWR with authentication
const fetcher = (url: string) => {
  const token = localStorage.getItem("adminToken"); // Assuming the token is stored here

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

// Custom hook to fetch all events
export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR<{ events: Event[] }>(
    EVENT_API_URL,
    fetcher
  );

  return { events: data?.events, isLoading, isError: error, mutate };
}

// Custom hook to fetch a single event by ID
export function useEvent(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ event: Event }>(
    `${EVENT_API_URL}/${id}`,
    fetcher
  );

  return { event: data?.event, isLoading, isError: error, mutate };
}

// Function to book an event with authentication token
export async function bookEvent(bookingData: EventRegistrationData) {
  try {
    const response = await axios.post(BOOK_EVENT_API_URL, bookingData);

    return response.data;
  } catch (error) {
    console.error("Error booking event:", error);
    throw error;
  }
}

// Function to update an existing event booking
export async function updateBooking(
  bookingId: string,
  updateData: Partial<EventRegistrationData>
) {
  try {
    const token = localStorage.getItem("adminToken"); // Retrieve the token

    const response = await axios.patch(
      `${BOOK_EVENT_API_URL}/${bookingId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
}

// Function to get all bookings
export async function getBookings() {
  try {
    const token = localStorage.getItem("adminToken"); // Retrieve the token

    const response = await axios.get(BOOK_EVENT_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

// Function to get a specific booking by its ID
export async function getBookingById(bookingId: string) {
  try {
    const token = localStorage.getItem("adminToken"); // Retrieve the token

    const response = await axios.get(`${BOOK_EVENT_API_URL}/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
}

// Function to delete a booking by its ID
export async function deleteBooking(bookingId: string) {
  try {
    const token = localStorage.getItem("adminToken"); // Retrieve the token

    const response = await axios.delete(`${BOOK_EVENT_API_URL}/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
}
