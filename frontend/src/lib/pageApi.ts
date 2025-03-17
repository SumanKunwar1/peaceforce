import axios, { AxiosError } from "axios";
import { IPageInput, IPageUpdate, IPageData } from "@/types/page";

const API_URL = "/api/page"; // Replace with your actual API URL

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (
      axiosError.response?.data &&
      typeof axiosError.response.data === "object" &&
      "error" in axiosError.response.data
    ) {
      throw new Error(axiosError.response.data.error as string);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    }
  } else if (error instanceof Error) {
    throw error;
  }
  throw new Error("An unknown error occurred");
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

export const pageApi = {
  createPage: async (pageData: IPageInput): Promise<IPageData | undefined> => {
    try {
      const response = await axios.post(`${API_URL}`, pageData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },

  getPages: async (): Promise<{ pages: IPageData[] } | undefined> => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },

  getPublishedPages: async (): Promise<{ pages: IPageData[] } | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/published/status`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },

  getPageBySlug: async (
    slug: string
  ): Promise<{ page: IPageData } | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/${slug}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },

  updatePage: async (
    pageId: string,
    pageData: IPageUpdate
  ): Promise<IPageData | undefined> => {
    try {
      const response = await axios.patch(`${API_URL}/${pageId}`, pageData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },

  deletePage: async (pageId: string): Promise<void | undefined> => {
    try {
      await axios.delete(`${API_URL}/${pageId}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },
};
