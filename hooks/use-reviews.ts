"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Review } from "@/lib/types";

// Get all reviews for a book
export const useReviews = (bookId: string) => {
  return useQuery<Review[], Error>({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
      const response = await apiClient.get<Review[]>(`/reviews?bookId=${bookId}`);
      return response.data;
    },
    enabled: !!bookId,
  });
};

// Get review by ID
export const useReview = (id: string) => {
  return useQuery<Review, Error>({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const response = await apiClient.get<Review>(`/reviews/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};