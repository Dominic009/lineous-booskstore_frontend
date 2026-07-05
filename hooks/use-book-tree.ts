"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { BookTreeResponse } from "@/lib/types";

export const useBookTree = () => {
  return useQuery<BookTreeResponse, Error>({
    queryKey: ["books", "tree"],
    queryFn: async () => {
      const response = await apiClient.get<BookTreeResponse | unknown>("/books/tree");
      const data = (response as { data?: BookTreeResponse }).data ?? response;
      if (!Array.isArray(data)) {
        throw new Error("Invalid book tree data");
      }
      return data;
    },
  });
};
