"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Category } from "@/lib/types";

// Get all categories
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<Category[]>("/categories");
      return response.data;
    },
  });
};

// Get category by ID
export const useCategory = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};