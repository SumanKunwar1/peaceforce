"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import type { IContactData } from "@/types/contact";

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<IContactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch all enquiries
  const fetchEnquiries = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Retrieve the admin token from localStorage and handle missing token case
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found in localStorage.");
        setIsError(true);
        setIsLoading(false);
        return; // Stop execution if there's no token
      }

      // Make the request
      const response = await axios.get<{ contacts: IContactData[] }>(
        "/api/contact",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check the structure of the response and handle accordingly
      if (response.data && response.data.contacts) {
        setEnquiries(response.data.contacts); // Assuming `setEnquiries` is the setter function for state
        setIsError(false); // Clear error state if the request is successful
      } else {
        console.error("Invalid response structure:", response);
        setIsError(true); // Set error if the expected data is not in the response
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setIsError(true); // Set error state in case of an error
    } finally {
      setIsLoading(false); // Stop loading after the request is finished
    }
  };

  // Fetch a single enquiry by ID
  const fetchEnquiryById = async (contactId: string) => {
    try {
      const response = await axios.get(`/api/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching enquiry:", error);
      throw error;
    }
  };

  // Create a new enquiry
  const createEnquiry = async (data: IContactData) => {
    try {
      await axios.post("/api/contact", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchEnquiries(); // Refetch enquiries after creating one
    } catch (error) {
      console.error("Error creating enquiry:", error);
      throw error;
    }
  };

  // Delete an enquiry
  const deleteEnquiry = async (enquiryId: string) => {
    try {
      await axios.delete(`/api/contact/${enquiryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchEnquiries(); // Refetch enquiries after deleting one
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []); // Run on mount

  const mutate = () => fetchEnquiries();

  return {
    enquiries,
    isLoading,
    isError,
    fetchEnquiryById,
    createEnquiry,
    deleteEnquiry,
    mutate,
  };
}
