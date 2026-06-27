"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Subject } from "@/lib/types";

// Get all subjects
export const useSubjects = () => {
  return useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await apiClient.get<Subject[]>("/subjects");
      return response.data;
    },
  });
};

// Get subject by ID
export const useSubject = (id: string) => {
  return useQuery<Subject, Error>({
    queryKey: ["subjects", id],
    queryFn: async () => {
      const response = await apiClient.get<Subject>(`/subjects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};