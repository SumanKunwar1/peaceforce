import axios from "axios";
import type { IMembershipTypes } from "@/pages/admin/MembershipTypes";

const API_URL = "/api/membership";

export const getMemberships = async (): Promise<{
  memberships: IMembershipTypes[];
}> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createMembership = async (
  data: Omit<IMembershipTypes, "id">
): Promise<IMembershipTypes> => {
  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const updateMembership = async (
  id: string,
  data: Partial<IMembershipTypes>
): Promise<IMembershipTypes> => {
  const response = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const deleteMembership = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};
