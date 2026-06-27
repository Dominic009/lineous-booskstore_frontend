"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Banner } from "@/lib/types";

// Get all banners
export const useBanners = () => {
  return useQuery<Banner[], Error>({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await apiClient.get<Banner[]>("/banners");
      return response.data;
    },
  });
};

// Get banner by ID
export const useBanner = (id: string) => {
  return useQuery<Banner, Error>({
    queryKey: ["banners", id],
    queryFn: async () => {
      const response = await apiClient.get<Banner>(`/banners/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};