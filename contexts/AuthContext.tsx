"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { removeToken, setToken } from "@/lib/api-client";
import { AuthUser, AuthResponse } from "@/lib/types";
import { useSocialLogin, type SocialProvider } from "@/hooks/use-social-login";

export interface User extends AuthUser {
  name?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  favoriteGenres?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  socialLogin: (
    provider: SocialProvider,
    providerId: string,
    email: string,
    firstName: string,
    lastName: string,
    avatar?: string,
  ) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get initial user from localStorage (only runs on client)
const getInitialUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use lazy initializer to set initial state from localStorage
  const [user, setUser] = useState<User | null>(() => getInitialUser());
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const socialLoginMutation = useSocialLogin();

  // Save user to localStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      const result = await loginMutation.mutateAsync({ email, password });
      const userData: User = {
        ...result.user,
        name: result.user.email.split("@")[0],
      };
      setUser(userData);
      setToken(result.accessToken);
      return result;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResponse> => {
      const result = await registerMutation.mutateAsync({ email, password });
      const userData: User = {
        ...result.user,
        name,
      };
      setUser(userData);
      setToken(result.accessToken);
      return result;
    },
    [registerMutation],
  );

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (typeof window === "undefined") return;

    setUser((prev) => {
      if (prev) {
        const updatedUser = { ...prev, ...updates };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prev;
    });
  }, []);

  const socialLogin = useCallback(
    async (
      provider: SocialProvider,
      providerId: string,
      email: string,
      firstName: string,
      lastName: string,
      avatar?: string,
    ): Promise<AuthResponse> => {
      const result = await socialLoginMutation.mutateAsync({
        provider,
        providerId,
        email,
        firstName,
        lastName,
        avatar,
      });

      const userData: User = {
        ...result.user,
        name: `${firstName} ${lastName}`,
        avatar: avatar || result.user.avatar,
      };

      setUser(userData);
      setToken(result.accessToken);
      return result;
    },
    [socialLoginMutation],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
