import axios from "axios";
import { IGalleryCategory, IGalleryEvent } from "../types/gallery";

const API_URL = "/api/gallery";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const fetchGalleryCategories = async (): Promise<IGalleryCategory[]> => {
  const response = await api.get("/");
  return response.data.galleryCategories;
};

export const fetchGalleryCategoryById = async (
  categoryId: string
): Promise<IGalleryCategory> => {
  const response = await api.get(`/${categoryId}`);

  return response.data.galleryCategory;
};

export const createGalleryCategory = async (
  name: string
): Promise<IGalleryCategory> => {
  const response = await api.post("/", { name });
  return response.data;
};

export const updateGalleryCategory = async (
  categoryId: string,
  name: string
): Promise<IGalleryCategory> => {
  const response = await api.patch(`/${categoryId}`, { name });
  return response.data;
};

export const deleteGalleryCategory = async (
  categoryId: string
): Promise<void> => {
  await api.delete(`/${categoryId}`);
};

export const insertGalleryEvent = async (
  categoryId: string,
  eventData: FormData
): Promise<IGalleryCategory> => {
  const response = await api.patch(`/event/${categoryId}`, eventData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateGalleryEvent = async (
  categoryId: string,
  eventId: string,
  eventData: FormData
): Promise<IGalleryCategory> => {
  const response = await api.patch(
    `/${categoryId}/event/${eventId}`,
    eventData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const insertEventImages = async (
  categoryId: string,
  eventId: string,
  formData: FormData
): Promise<IGalleryCategory> => {
  const response = await api.patch(
    `/${categoryId}/event/${eventId}/images`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const deleteEventImage = async (
  categoryId: string,
  eventId: string,
  imageUrl: string
): Promise<IGalleryCategory> => {
  const response = await api.delete(`/${categoryId}/event/${eventId}/images`, {
    data: { images: [imageUrl] },
  });
  return response.data;
};

export const deleteEvent = async (
  categoryId: string,
  eventId: string
): Promise<void> => {
  await api.delete(`/${categoryId}/event/${eventId}`);
};

export const getEventById = async (
  categoryId: string,
  eventId: string
): Promise<IGalleryEvent> => {
  const response = await api.get(`/${categoryId}/event/${eventId}`);
  console.log(
    "response returned for geteventbyid",
    response,
    "response data",
    response.data
  );
  return response.data;
};
