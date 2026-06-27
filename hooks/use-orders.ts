"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import { Order } from "@/lib/types";

// Get all orders
export const useOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await apiClient.get<Order[]>("/orders");
      return response.data;
    },
  });
};

// Get order by ID
export const useOrder = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { addressId: string; discount?: number; shipping?: number; paymentMethod?: string; notes?: string }>({
    mutationFn: async (data) => {
      const response = await apiClient.post<Order>("/orders", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};