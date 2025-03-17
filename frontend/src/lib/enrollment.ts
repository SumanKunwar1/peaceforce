import axios from "axios";
import { EnrollmentFormData } from "../types/course";
import { Enrollment } from "@/pages/admin/Enrollments";
const BASE_URL = "/api"; // Replace with your actual API URL

const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken"); // Adjust if using a different storage method
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createEnrollment = async (
  enrollmentData: EnrollmentFormData
): Promise<void> => {
  console.log("Enrollment data in create", enrollmentData);
  await axios.post(`${BASE_URL}/enrollment`, enrollmentData);
};

export const getEnrollments = async (): Promise<{
  enrollments: Enrollment[];
}> => {
  const response = await axios.get(`${BASE_URL}/enrollment`, getAuthHeader());
  return response.data;
};

export const getEnrollmentById = async (
  enrollmentId: string
): Promise<Enrollment> => {
  const response = await axios.get(
    `${BASE_URL}/enrollment/${enrollmentId}`,
    getAuthHeader()
  );
  return response.data;
};

export const updateEnrollment = async (
  enrollmentId: string,
  enrollmentData: Partial<EnrollmentFormData>
): Promise<void> => {
  await axios.patch(
    `${BASE_URL}/enrollment/${enrollmentId}`,
    enrollmentData,
    getAuthHeader()
  );
};

export const deleteEnrollment = async (enrollmentId: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/enrollment/${enrollmentId}`, getAuthHeader());
};
