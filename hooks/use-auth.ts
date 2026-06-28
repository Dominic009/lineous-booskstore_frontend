"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, setToken, removeToken, ApiError } from "@/lib/api-client";
import { AuthResponse, AuthUser } from "@/lib/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

// Login hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
      return response as unknown as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(["user"], data.user);
      toast.success("Login successful", {
        description: "Welcome back!",
      });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Register hook
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AuthResponse>("/auth/signup", data);
      return response as unknown as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(["user"], data.user);
      toast.success("Registration successful", {
        description: "Your account has been created!",
      });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    queryClient.clear();
    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    });
  };
};

// Get current user hook
export const useCurrentUser = () => {
  return {
    data: null as AuthUser | null,
    isLoading: false,
  };
};