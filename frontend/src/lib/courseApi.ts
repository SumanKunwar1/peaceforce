import axios from "axios";
import type { ICourse } from "@/types/course";

const COURSE_API_URL = "/api/course";

// Axios instance with default headers
const api = axios.create({
  baseURL: COURSE_API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  },
});

// Set the authorization token
export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Get all courses
export const getCourses = async (): Promise<ICourse[]> => {
  const response = await api.get("/");
  return response.data.courseCategories;
};

// Get a specific course by ID
export const getCourseById = async (courseId: string): Promise<ICourse> => {
  const response = await api.get(`/${courseId}`);
  return response.data.courseCategory;
};

// Create a new course
export const createCourse = async (courseData: FormData): Promise<ICourse> => {
  const response = await api.post("/", courseData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update an existing course
export const updateCourse = async (
  courseId: string,
  courseData: FormData
): Promise<ICourse> => {
  const response = await api.patch(`/${courseId}`, courseData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<void> => {
  await api.delete(`/${courseId}`);
};

// Debugging utility
export const debugLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${message}`, data);
  }
};
