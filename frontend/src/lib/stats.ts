import axios from "axios";
import { Stat, IStatsInput } from "@/types/stats";

const API_URL = "/api/stats"; // Adjust based on your backend setup
const adminToken = localStorage.getItem("adminToken") || "";
// Fetch all stats
interface StatsResponse {
  stats: Stat[];
}
export const getStats = async (): Promise<Stat[]> => {
  try {
    const response = await axios.get<StatsResponse>(`${API_URL}`);
    console.log("Fetched stats:", response.data);
    return response.data.stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
// Create or Update a stat (Authenticated)
export const updateStat = async (updatedStat: IStatsInput): Promise<Stat> => {
  const response = await axios.put(API_URL, updatedStat, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Delete a stat (Authenticated)
export const deleteStat = async (): Promise<void> => {
  await axios.delete(API_URL, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};
