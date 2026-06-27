"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Book } from "@/lib/types";

// Get all books
export const useBooks = () => {
  return useQuery<Book[], Error>({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await apiClient.get<Book[]>("/books");
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