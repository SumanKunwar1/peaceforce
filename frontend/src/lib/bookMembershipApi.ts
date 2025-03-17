import axios from "axios";
import { IBookMembership, IBookMembershipInput } from "@/types/bookMembership";

const API_URL = "/api/book-membership";

export const createBookMembership = async (
  data: IBookMembershipInput
): Promise<IBookMembership> => {
  const formData = new FormData();

  // Append non-file fields
  Object.keys(data).forEach((key) => {
    const typedKey = key as keyof IBookMembershipInput; // Type assertion

    if (typedKey !== "image" && typedKey !== "paymentScreenshot") {
      if (typedKey === "mailingAddress" && typeof data[typedKey] === "object") {
        const mailingAddress = data[typedKey]; // Safely access mailingAddress

        // Append each property of mailingAddress separately
        Object.keys(mailingAddress).forEach((addressKey) => {
          const typedAddressKey = addressKey as keyof typeof mailingAddress; // Cast to ensure it's a valid property

          const value = (mailingAddress as Record<string, any>)[
            typedAddressKey
          ];

          // Only append if the value is not undefined
          if (value !== undefined) {
            formData.append(
              `mailingAddress[${addressKey}]`,
              value as string // Cast to string
            );
          }
        });
      } else {
        const value = data[typedKey];

        // Only append if the value is not undefined
        if (value !== undefined) {
          formData.append(typedKey, value as string); // Cast to string
        }
      }
    }
  });

  // Append file fields
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }
  if (data.paymentScreenshot instanceof File) {
    formData.append("paymentScreenshot", data.paymentScreenshot);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error while creating book membership:", error);
    throw error;
  }
};

export const updateBookMembership = async (
  id: string,
  membershipData: FormData
): Promise<IBookMembership> => {
  const response = await axios.patch(`${API_URL}/${id}`, membershipData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const getBookMemberships = async (): Promise<{
  bookMemberships: IBookMembership[];
}> => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const getBookMembershipById = async (
  id: string
): Promise<IBookMembership> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const deleteBookMembership = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};
