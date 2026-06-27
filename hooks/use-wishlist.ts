"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import { WishlistItem } from "@/lib/types";

// Get wishlist
export const useWishlist = () => {
  return useQuery<WishlistItem[], Error>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await apiClient.get<WishlistItem[]>("/wishlist");
      return response.data;
    },
  });
};

// Add to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<WishlistItem, Error, string>({
    mutationFn: async (bookId) => {
      const response = await apiClient.post<WishlistItem>("/wishlist", { bookId });
      return response.data;
    },
    onSuccess: (data, bookId) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Book added to wishlist");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Remove from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (bookId) => {
      await apiClient.delete<void>(`/wishlist/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Book removed from wishlist");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};