"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Only access localStorage on client
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Use a simple assignment pattern instead of setState
          setUser(parsed);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && initialized.current) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else if (initialized.current) {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    // Mock login - check stored users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.some((u: { email: string }) => u.email === email);

    if (exists) {
      return false;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (typeof window === 'undefined') return;
    
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // Also update in users storage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u: User & { password?: string }) =>
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
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
