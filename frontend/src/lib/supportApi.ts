import axios from "axios";
import type { ISupport, ISupportInput } from "../types/support";

const API_URL = "/api";

export const supportApi = {
  getSupport: async (): Promise<{ support: ISupport }> => {
    const response = await axios.get(`${API_URL}/support`);
    return response.data;
  },

  updateSupport: async (supportData: ISupportInput): Promise<ISupport> => {
    const response = await axios.put(`${API_URL}/support`, supportData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },

  deleteSupport: async (): Promise<void> => {
    await axios.delete(`${API_URL}/support`);
  },
};
