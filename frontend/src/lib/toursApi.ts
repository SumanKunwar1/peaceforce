import axios from "axios";
import type { Tour } from "../types/tour";

const API_URL = "/api";

// You can store the token in localStorage or get it from a context/store
const getAuthToken = () => {
  return localStorage.getItem("adminToken"); // Example of getting token from localStorage
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to the request header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to sanitize tour data by removing MongoDB-specific fields
const sanitizeTourData = (tourData: Partial<Tour>): Partial<Tour> => {
  // Create a new object without the MongoDB fields
  const { _id, id, createdAt, updatedAt, __v, ...sanitizedData } =
    tourData as any;

  return sanitizedData;
};

export const getTours = async (): Promise<Tour[]> => {
  const response = await axiosInstance.get("/tour");
  return response.data.tours;
};

export const getTourById = async (id: string): Promise<Tour> => {
  const response = await axiosInstance.get(`/tour/${id}`);
  return response.data.tour;
};

export const createTour = async (tourData: Partial<Tour>): Promise<Tour> => {
  // Sanitize data before sending to API
  const sanitizedData = sanitizeTourData(tourData);

  const response = await axiosInstance.post("/tour", sanitizedData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateTour = async (
  id: string,
  tourData: Partial<Tour>
): Promise<Tour> => {
  // Sanitize data before sending to API
  const sanitizedData = sanitizeTourData(tourData);

  let formData: FormData | Partial<Tour>;
  let contentType: string;

  if (sanitizedData.image instanceof File) {
    formData = new FormData();
    // Add all sanitized fields to FormData
    Object.entries(sanitizedData).forEach(([key, value]) => {
      if (value instanceof File) {
        (formData as FormData).append(key, value);
      } else if (
        Array.isArray(value) ||
        (typeof value === "object" && value !== null)
      ) {
        (formData as FormData).append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        (formData as FormData).append(key, String(value));
      }
    });
    contentType = "multipart/form-data";
  } else {
    formData = sanitizedData;
    contentType = "application/json";
  }

  const response = await axiosInstance.patch(`/tour/${id}`, formData, {
    headers: {
      "Content-Type": contentType,
    },
  });
  return response.data;
};

export const deleteTour = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tour/${id}`);
};
