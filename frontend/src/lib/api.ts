import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { IProgram } from "../types/program";
import type { Event } from "../types/event";
import type { User } from "../types/users";
import axios from "axios";

// Base API URLs
const PROGRAM_API_URL = "/api/program";
const EVENT_API_URL = "/api/event";
const USER_API_URL = "/api/user";
const api = axios.create({
  baseURL: USER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());
// Fetcher function with Authorization Header
const fetcherWithAuth = (url: string) =>
  fetch(url, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

// Helper function to get headers
const getHeaders = (isJSON: boolean = true) => {
  const headers: HeadersInit = {
    authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  };
  if (isJSON) headers["Content-Type"] = "application/json";
  return headers;
};

// Generic API request function
async function sendRequest(url: string, method: string, data?: any) {
  try {
    const headers = getHeaders(!(data instanceof FormData));
    const response = await fetch(url, {
      method,
      headers,
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.error("Request Error:", error);
    throw error;
  }
}

/* ----------------- Program API Hooks ----------------- */

export function usePrograms() {
  const { data, error, isLoading, mutate } = useSWR<{ programs: IProgram[] }>(
    PROGRAM_API_URL,
    fetcher
  );

  return { programs: data?.programs, isLoading, isError: error, mutate };
}

export function useProgram(id: string) {
  const { data, error, isLoading } = useSWR<{ program: IProgram }>(
    `${PROGRAM_API_URL}/${id}`,
    fetcher
  );

  return { program: data?.program, isLoading, isError: error };
}

export function useCreateProgram() {
  return useSWRMutation(
    PROGRAM_API_URL,
    async (url, { arg }: { arg: FormData }) => sendRequest(url, "POST", arg)
  );
}

export function useUpdateProgram(id: string) {
  return useSWRMutation(
    `${PROGRAM_API_URL}/${id}`,
    async (url, { arg }: { arg: FormData }) => sendRequest(url, "PATCH", arg)
  );
}

export async function deleteProgram(id: string) {
  return sendRequest(`${PROGRAM_API_URL}/${id}`, "DELETE");
}

/* ----------------- Event API Hooks ----------------- */

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR<{ events: Event[] }>(
    EVENT_API_URL,
    fetcher
  );

  return { events: data?.events, isLoading, isError: error, mutate };
}

export function useEvent(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ event: Event }>(
    `${EVENT_API_URL}/${id}`,
    fetcher
  );

  return { event: data?.event, isLoading, isError: error, mutate };
}

export async function addEvent(eventData: FormData): Promise<Event> {
  return sendRequest(EVENT_API_URL, "POST", eventData);
}

export async function updateEvent(
  id: string,
  eventData: FormData
): Promise<Event> {
  return sendRequest(`${EVENT_API_URL}/${id}`, "PATCH", eventData);
}

export async function deleteEvent(id: string): Promise<void> {
  return sendRequest(`${EVENT_API_URL}/${id}`, "DELETE");
}

/* ----------------- User API Hooks ----------------- */

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<{ users: User[] }>(
    USER_API_URL,
    fetcherWithAuth
  );

  const addUser = async (newUser: Partial<User>): Promise<User> => {
    const response = await fetch(USER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    const addedUser = await response.json();
    mutate();
    return addedUser;
  };

  return {
    users: data?.users || [],
    isLoading,
    isError: error,
    mutate,
    addUser,
  };
}

export const submitJobApplication = async (formData: FormData) => {
  try {
    const response = await api.post("/job", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting job application:", error);
    throw error;
  }
};

export const debugLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) console.log(`[DEBUG] ${message}`, data);
};
