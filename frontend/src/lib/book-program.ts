import axios from "axios";
import type { ProgramRegistrationData } from "../types/program";
import { ProgramBooking } from "@/pages/admin/ProgramBooking";
// Get the API URL from environment variables
const API_URL = "/api";

// Helper function to get the token (from localStorage or another secure place)
const getAuthToken = () => {
  return localStorage.getItem("adminToken") || ""; // Adjust this based on how you store your token
};

export const bookProgram = async (
  programId: string,
  data: ProgramRegistrationData
) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/book-program`,
      {
        programId,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        page: data.page,
        pageTitle: data.pageTitle,
        participants: data.participants,
        specialRequirements: data.specialRequirements,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adding the token to the header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error booking program:", error);
    throw error;
  }
};

export const getBookings = async (): Promise<{
  bookings: ProgramBooking[];
}> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/book-program`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getBookingById = async (
  bookingId: string
): Promise<ProgramBooking> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/book-program/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const updateBooking = async (
  bookingId: string,
  data: Partial<ProgramRegistrationData>
) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${API_URL}/book-program/${bookingId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adding the token to the header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `${API_URL}/book-program/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adding the token to the header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
