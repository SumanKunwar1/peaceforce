import useSWR from "swr";
import type { BlogPost } from "../types/blog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBlogPosts() {
  const { data, error, isLoading, mutate } = useSWR<{
    blogPosts: BlogPost[];
    totalPages: number;
    currentPage: number;
  }>(`/api/blogpost`, fetcher);

  return {
    blogPosts: data?.blogPosts || [],
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || 1,
    isLoading,
    isError: error,
    mutate,
  };
}
