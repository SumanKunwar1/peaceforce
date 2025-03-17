import axios from "axios";
import type { IDonationData } from "@/types/donation";

const API_URL = "/api";

const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDonations = async (): Promise<IDonationData[]> => {
  const response = await axiosInstance.get<{ donations: IDonationData[] }>(
    "/donation"
  );
  return response.data.donations;
};

export const getDonationById = async (id: string): Promise<IDonationData> => {
  const response = await axiosInstance.get<{ donation: IDonationData }>(
    `/donation/${id}`
  );
  return response.data.donation;
};

export const createDonation = async (
  donationData: FormData
): Promise<IDonationData> => {
  const response = await axiosInstance.post<IDonationData>(
    "/donation",
    donationData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteDonation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/donation/${id}`);
};
