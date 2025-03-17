import axios from "axios";
import { IAbout } from "../types/about";

const API_URL = "/api";

export const aboutApi = {
  getAbout: async (): Promise<{ about: IAbout[] }> => {
    const response = await axios.get(`${API_URL}/about`);
    return response.data;
  },

  updateAbout: async (data: FormData): Promise<IAbout> => {
    const response = await axios.put(`${API_URL}/about`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },
};
