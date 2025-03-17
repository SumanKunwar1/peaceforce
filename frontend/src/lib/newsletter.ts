import useSWR from "swr";
import { Newsletter } from "@/pages/admin/Newsletters";

const API_URL = "/api/news-letter";

// Fetch function to be used by useSWR
async function fetcher(url: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Attach admin token for auth
    },
  });
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
}

// Custom hook for getting newsletters
export function useNewsletters() {
  const { data, error, mutate } = useSWR<{ newsLetters: Newsletter[] }>(
    API_URL,
    fetcher
  );

  return {
    newsletters: data?.newsLetters,
    isLoading: !error && !data,
    isError: error,
    mutate, // This can be used to re-fetch data after actions like delete
  };
}

// Function to get a specific newsletter by ID with authorization
export async function getNewsletterById(id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Attach admin token for auth
    },
  });

  if (!res.ok) {
    throw new Error("An error occurred while fetching the newsletter by ID.");
  }

  return res.json();
}

// Function to create a newsletter (POST request) without authorization
export async function createNewsletter(newsletterData: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newsletterData), // The data to be created
  });

  if (!res.ok) {
    throw new Error("An error occurred while creating the newsletter.");
  }

  return res.json();
}

// Function to delete a newsletter (DELETE request) with authorization
export async function deleteNewsletter(id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Attach admin token for auth
    },
  });

  if (!res.ok) {
    throw new Error(
      "An error occurred while deleting the newsletter subscription."
    );
  }

  return res.json();
}
