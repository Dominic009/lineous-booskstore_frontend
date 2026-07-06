"use client";

import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { useSocialLogin } from "@/hooks/use-social-login";
import { useAuth } from "./AuthContext";
import { SocialProfile, SocialLoginError } from "@/lib/social-login";

const SocialLoginContext = createContext<{
  authenticate: (
    profile: SocialProfile & { provider: "GOOGLE" | "FACEBOOK" | "APPLE" },
  ) => Promise<void>;
} | null>(null);

export const SocialLoginProvider = ({ children }: { children: ReactNode }) => {
  const socialLoginMutation = useSocialLogin();
  const { socialLogin } = useAuth();

  const authenticate = useCallback(
    async (
      profile: SocialProfile & { provider: "GOOGLE" | "FACEBOOK" | "APPLE" },
    ) => {
      const result = await socialLoginMutation.mutateAsync(profile);
      await socialLogin(
        profile.provider,
        profile.providerId,
        profile.email,
        profile.firstName,
        profile.lastName,
        profile.avatar,
      );
    },
    [socialLoginMutation, socialLogin],
  );

  return (
    <SocialLoginContext.Provider value={{ authenticate }}>
      {children}
    </SocialLoginContext.Provider>
  );
};

export const useSocialLoginContext = () => {
  const context = useContext(SocialLoginContext);
  if (!context) {
    throw new Error(
      "useSocialLoginContext must be used within SocialLoginProvider",
    );
  }
  return context;
};
