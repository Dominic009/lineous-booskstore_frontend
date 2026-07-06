"use client";

import { SocialProfile, SocialLoginError } from "./types";

interface AppleConfig {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
  redirectUri: string;
}

interface AppleCredentialState {
  user: string;
  email: string;
  emailVerified: boolean;
  realUserStatus: { name: string; status: string };
  authorizationCode: string;
  identityToken: string;
  firstName?: string;
  lastName?: string;
}

interface AppleAuthConfig {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
  redirectURI: string;
  scope: string;
  state: string;
}

let isInitialized = false;

export const initApple = (config: AppleConfig): void => {
  if (typeof window === "undefined" || isInitialized) return;

  const script = document.createElement("script");
  script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    const appleAuth = (window as unknown as Record<string, unknown>).AppleID;
    if (!appleAuth) return;

    (appleAuth as { auth: { init: (config: AppleAuthConfig) => void } }).auth.init({
      clientId: config.clientId,
      teamId: config.teamId,
      keyId: config.keyId,
      privateKey: config.privateKey,
      redirectURI: config.redirectUri,
      scope: "name email",
      state: "init",
    });

    isInitialized = true;
  };
};

export const loginWithApple = (): Promise<AppleCredentialState> => {
  return new Promise((resolve, reject) => {
    if (!isInitialized) {
      reject({ provider: "APPLE", message: "Apple Sign In not initialized" } as SocialLoginError);
      return;
    }

    (window as unknown as { AppleID: { auth: { signIn: () => void } } }).AppleID.auth.signIn();
  });
};

export const handleAppleCallback = (state: unknown): SocialProfile => {
  const credential = state as AppleCredentialState;

  if (!credential.email) {
    throw { provider: "APPLE", message: "No email returned from Apple" } as SocialLoginError;
  }

  return {
    email: credential.email,
    providerId: credential.user,
    firstName: credential.firstName || "",
    lastName: credential.lastName || "",
  };
};
