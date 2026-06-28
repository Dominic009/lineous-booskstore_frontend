"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, setToken, removeToken } from "@/lib/api-client";
import { AuthResponse, AuthUser } from "@/lib/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

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
    },
  });
};

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
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    queryClient.clear();
  };
};

export const useCurrentUser = () => {
  return {
    data: null as AuthUser | null,
    isLoading: false,
  };
};