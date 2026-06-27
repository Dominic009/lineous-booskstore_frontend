"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Publication } from "@/lib/types";

// Get all publications
export const usePublications = () => {
  return useQuery<Publication[], Error>({
    queryKey: ["publications"],
    queryFn: async () => {
      const response = await apiClient.get<Publication[]>("/publications");
      return response.data;
    },
  });
};

// Get publication by ID
export const usePublication = (id: string) => {
  return useQuery<Publication, Error>({
    queryKey: ["publications", id],
    queryFn: async () => {
      const response = await apiClient.get<Publication>(`/publications/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};