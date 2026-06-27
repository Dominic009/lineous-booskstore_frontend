"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Setting } from "@/lib/types";

// Get all settings
export const useSettings = () => {
  return useQuery<Setting[], Error>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiClient.get<Setting[]>("/settings");
      return response.data;
    },
  });
};

// Get setting by key
export const useSetting = (key: string) => {
  return useQuery<Setting | null, Error>({
    queryKey: ["settings", key],
    queryFn: async () => {
      const response = await apiClient.get<Setting | null>(`/settings/${key}`);
      return response.data;
    },
    enabled: !!key,
  });
};