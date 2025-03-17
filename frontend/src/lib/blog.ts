import axios from "axios";
import { BlogPost } from "../types/blog";

const API_URL = "/api"; // Replace with your actual API URL

export const api = axios.create({
  baseURL: API_URL,
});

export const getBlogPosts = async (): Promise<{ blogPosts: BlogPost[] }> => {
  const response = await api.get("/blogpost");
  return response.data;
};

export const getBlogPostById = async (
  id: string
): Promise<{ blogPost: BlogPost }> => {
  const response = await api.get(`/blogpost/${id}`);
  return response.data;
};
