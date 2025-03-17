import type { ITeamData } from "@/types/team";

const API_URL = "/api/team";

// Function to get all team members (no authentication required)
export async function getTeamMembers(): Promise<{ teamMembers: ITeamData[] }> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch team members");
  }
  return res.json();
}

// Function to get a specific team member by ID (no authentication required)
export async function getTeamMemberById(
  id: string
): Promise<{ teamMembers: ITeamData }> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch team member");
  }
  return res.json();
}

// Function to create a new team member (requires authentication)
export async function createTeamMember(data: FormData): Promise<ITeamData> {
  const token = localStorage.getItem("adminToken"); // Assuming the token is stored in localStorage
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Add token to the Authorization header
    },
    body: data,
  });
  if (!res.ok) {
    throw new Error("Failed to create team member");
  }
  return res.json();
}

// Function to update an existing team member (requires authentication)
export async function updateTeamMember(
  id: string,
  data: FormData
): Promise<ITeamData> {
  const token = localStorage.getItem("adminToken"); // Assuming the token is stored in localStorage
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // Add token to the Authorization header
    },
    body: data,
  });
  if (!res.ok) {
    throw new Error("Failed to update team member");
  }
  return res.json();
}

// Function to delete a team member (requires authentication)
export async function deleteTeamMember(id: string): Promise<void> {
  const token = localStorage.getItem("adminToken"); // Assuming the token is stored in localStorage
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // Add token to the Authorization header
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete team member");
  }
}
