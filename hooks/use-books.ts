"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Book } from "@/lib/types";

// Get all books or books by subject
export const useBooks = (subjectId?: string) => {
  return useQuery<Book[], Error>({
    queryKey: ["books", subjectId],
    queryFn: async () => {
      const url = subjectId ? `/books?subjectId=${subjectId}` : "/books";
      const response = await apiClient.get<Book[]>(url);
      return response.data;
    },
  });
};

// Get book by ID
export const useBook = (id: string) => {
  return useQuery<Book, Error>({
    queryKey: ["books", id],
    queryFn: async () => {
      const response = await apiClient.get<Book>(`/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};