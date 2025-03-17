import axios from "axios";
import type { JobPosting } from "@/types/career";

const API_URL = "/api/jobpost";

// Assuming you have a function to get the admin token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem("adminToken"); // Replace this with your token retrieval method
};

export const careersApi = {
  async getJobPostings(): Promise<JobPosting[]> {
    const response = await axios.get<{ jobPosts: JobPosting[] }>(API_URL);
    return response.data.jobPosts;
  },

  async createJobPosting(
    jobPosting: Omit<JobPosting, "id">
  ): Promise<JobPosting> {
    const token = getAuthToken();
    const response = await axios.post<JobPosting>(API_URL, jobPosting, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateJobPosting(
    id: string,
    jobPosting: Partial<JobPosting>
  ): Promise<JobPosting> {
    const token = getAuthToken();
    const response = await axios.patch<JobPosting>(
      `${API_URL}/${id}`,
      jobPosting,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async deleteJobPosting(id: string): Promise<void> {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
