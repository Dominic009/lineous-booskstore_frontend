"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError, getToken, BASE_URL } from "@/lib/api-client";
import { Order, Receipt } from "@/lib/types";

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

// Verify receipt by receipt number (public endpoint)
export const useVerifyReceipt = (receiptNumber: string) => {
  return useQuery<Receipt, Error>({
    queryKey: ["receipt", receiptNumber],
    queryFn: async () => {
      const response = await apiClient.get<Receipt>(
        `/receipts/verify/${receiptNumber}`
      );
      return response.data;
    },
    enabled: !!receiptNumber,
  });
};

// Download receipt PDF (auth required, 302 redirect to Cloudinary)
export const useDownloadReceipt = () => {
  return useMutation<void, ApiError, string>({
    mutationFn: async (orderId: string) => {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/orders/${orderId}/receipt`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        redirect: "follow",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(
          data.message || "Failed to download receipt",
          response.status,
          data.errors
        );
      }

      const pdfUrl = response.url;
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      }
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to download receipt");
      }
    },
  });
};