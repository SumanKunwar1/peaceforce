import axios from "axios";
import { mutate } from "swr";
import { toast } from "@/hooks/use-toast";
import type { FAQ } from "@/types/faq";
import useSWR from "swr";

const API_URL = "/api/faq";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("adminToken") || "";
};

// Axios instance with auth
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const faqApi = {
  async getFAQs() {
    const response = await axiosInstance.get<{ faqs: FAQ[] }>(API_URL);
    return response.data.faqs;
  },

  //   export const getFAQById = async (id: string): Promise<FAQ> => {
  //   const response = await api.get<FAQ>(`/faq/${id}`)
  //   return response.data
  // }

  async getFAQById(id: string): Promise<FAQ> {
    const response = await axiosInstance.get<FAQ>(`${API_URL}/${id}`);
    return response.data;
  },

  async createFAQ(faq: Omit<FAQ, "id">) {
    try {
      const response = await axiosInstance.post<FAQ>(API_URL, faq, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      toast({
        title: "FAQ Created",
        description: "The new FAQ has been successfully added.",
      });

      mutate(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error creating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to create FAQ. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },

  async updateFAQ(id: string, faq: Partial<Omit<FAQ, "id">>) {
    try {
      const response = await axiosInstance.patch<FAQ>(`${API_URL}/${id}`, faq, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      toast({
        title: "FAQ Updated",
        description: "The FAQ has been successfully updated.",
      });

      mutate(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to update FAQ. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },

  async deleteFAQ(id: string) {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      toast({
        title: "FAQ Deleted",
        description: "The FAQ has been successfully removed.",
      });

      mutate(API_URL);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
};

// SWR Hook for fetching FAQs
export const useFAQs = () => {
  const { data, error, isLoading } = useSWR<FAQ[]>(API_URL, faqApi.getFAQs);

  return {
    faqs: data,
    isLoading,
    isError: error,
  };
};
