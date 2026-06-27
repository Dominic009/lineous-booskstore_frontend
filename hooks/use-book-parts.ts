"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { BookPart } from "@/lib/types";

// Get all book parts for a book
export const useBookParts = (bookId: string) => {
  return useQuery<BookPart[], Error>({
    queryKey: ["book-parts", bookId],
    queryFn: async () => {
      const response = await apiClient.get<BookPart[]>(`/book-parts?bookId=${bookId}`);
      return response.data;
    },
    enabled: !!bookId,
  });
};

// Get book part by ID
export const useBookPart = (id: string) => {
  return useQuery<BookPart, Error>({
    queryKey: ["book-parts", id],
    queryFn: async () => {
      const response = await apiClient.get<BookPart>(`/book-parts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};