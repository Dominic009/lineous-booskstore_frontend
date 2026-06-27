"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Teacher } from "@/lib/types";

// Get all teachers
export const useTeachers = () => {
  return useQuery<Teacher[], Error>({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await apiClient.get<Teacher[]>("/teachers");
      return response.data;
    },
  });
};

// Get teacher by ID
export const useTeacher = (id: string) => {
  return useQuery<Teacher, Error>({
    queryKey: ["teachers", id],
    queryFn: async () => {
      const response = await apiClient.get<Teacher>(`/teachers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};