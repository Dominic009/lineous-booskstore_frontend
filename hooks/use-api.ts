import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";

// Utility function for handling API errors with sonner
export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    toast.error(error.message);
    if (error.errors) {
      error.errors.forEach((err) => {
        toast.error(`${err.field}: ${err.message}`);
      });
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  }
};

// Base query hook with error handling
export const useApiQuery = <T>(
  key: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<T>(endpoint);
      return response.data;
    },
    ...options,
  });
};

// Base mutation hook with error handling
export const useApiMutation = <T, V = unknown>(
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE",
  options?: Omit<UseMutationOptions<T, Error, V>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, V>({
    mutationFn: async (data: V) => {
      let response;
      if (method === "POST") {
        response = await apiClient.post<T>(endpoint, data);
      } else if (method === "PATCH") {
        response = await apiClient.patch<T>(endpoint, data);
      } else {
        response = await apiClient.delete<T>(endpoint);
      }
      return response.data;
    },
    onError: (error) => {
      handleApiError(error);
    },
    ...options,
  });
};