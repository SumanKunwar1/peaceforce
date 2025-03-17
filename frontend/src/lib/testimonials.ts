import axios from "axios";
import { Testimonial, ITestimonialInput } from "@/types/testimonials";

const API_URL = "/api/testimonial"; // Adjust based on your backend setup

// Fetch all testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Fetch a single testimonial by ID
export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a testimonial
export const createTestimonial = async (
  newTestimonial: ITestimonialInput
): Promise<Testimonial> => {
  const response = await axios.post(API_URL, newTestimonial);
  return response.data;
};

// Update a testimonial
export const updateTestimonial = async (
  id: string,
  updatedTestimonial: ITestimonialInput
): Promise<Testimonial> => {
  const response = await axios.patch(`${API_URL}/${id}`, updatedTestimonial);
  return response.data;
};

// Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
