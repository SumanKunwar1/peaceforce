import axios from "axios";
import { ISeoMetaInput, ISeoMetaUpdate, ISeoMeta } from "@/types/seoMeta";

const API_URL = "/api/global-meta";

export const getSeoMeta = async (): Promise<{ seoMeta: ISeoMeta[] }> => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const getSeoMetaByPage = async (
  pageTitle: string
): Promise<ISeoMeta | null> => {
  try {
    const response = await axios.get(`${API_URL}/${pageTitle}`);
    // console.log("getSeoMetaByPage Response:", response.data);

    // Ensure the response contains expected data
    if (response.data && response.data.seoMeta) {
      return response.data.seoMeta;
    }

    console.warn(`SEO data for ${pageTitle} not found, falling back to global`);
    return null;
  } catch (error) {
    console.error(`Error fetching SEO data for ${pageTitle}:`, error);
    return null;
  }
};

export const createSeoMeta = async (data: ISeoMetaInput) => {
  console.log("seoMetaApi.ts createSeoMeta data: ", API_URL, data);
  const response = await axios.post(`${API_URL}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const updateSeoMeta = async (
  seoMetaId: string,
  data: ISeoMetaUpdate
) => {
  const response = await axios.patch(`${API_URL}/${seoMetaId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

export const deleteSeoMeta = async (seoMetaId: string) => {
  const response = await axios.delete(`${API_URL}${seoMetaId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};
