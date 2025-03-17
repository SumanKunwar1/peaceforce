import { IInfoSectionInput, IInfoSectionData } from "@/types/infoSection";

const API_URL = "/api/info-section";

// Fetch function for GET request
export async function getInfoSection(): Promise<{
  infoSection: IInfoSectionData;
}> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch InfoSection");
  }
  return res.json();
}

// Function to create an InfoSection (PUT request) with authentication
export async function createInfoSection(
  data: IInfoSectionInput
): Promise<IInfoSectionData> {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Attach admin token for authentication
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create InfoSection");
  }
  return res.json();
}

// Function to update an InfoSection (PUT request) with authentication
export async function updateInfoSection(
  data: IInfoSectionInput
): Promise<IInfoSectionData> {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Attach admin token for authentication
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update InfoSection");
  }
  return res.json();
}

// Function to delete an InfoSection (DELETE request) with authentication
export async function deleteInfoSection(): Promise<void> {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Attach admin token for authentication
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete InfoSection");
  }
}
