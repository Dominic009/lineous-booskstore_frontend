"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import { Address } from "@/lib/types";

// Get all addresses
export const useAddresses = () => {
  return useQuery<Address[], Error>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await apiClient.get<Address[]>("/addresses");
      return response.data;
    },
  });
};

// Create address
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, Partial<Address>>({
    mutationFn: async (data) => {
      const response = await apiClient.post<Address>("/addresses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address created successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Get address by ID
export const useAddress = (id: string) => {
  return useQuery<Address, Error>({
    queryKey: ["addresses", id],
    queryFn: async () => {
      const response = await apiClient.get<Address>(`/addresses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, { id: string; data: Partial<Address> }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch<Address>(`/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address updated successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete<void>(`/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};