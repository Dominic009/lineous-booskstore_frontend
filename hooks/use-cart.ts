"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import { Cart, CartItem } from "@/lib/types";

// Get cart
export const useCart = (userId?: string) => {
  return useQuery<Cart, Error>({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await apiClient.get<Cart>("/cart");
      return response.data;
    },
  });
};

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, { bookId: string; paperId?: string; quantity: number }>({
    mutationFn: async (data) => {
      const response = await apiClient.post<Cart>("/cart", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Book added to cart");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, { cartItemId: string; quantity: number }>({
    mutationFn: async ({ cartItemId, quantity }) => {
      const response = await apiClient.patch<CartItem>(`/cart/items/${cartItemId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Remove from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (cartItemId) => {
      await apiClient.delete<void>(`/cart/items/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Book removed from cart");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiClient.delete<void>("/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // toast.success("Cart cleared");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};