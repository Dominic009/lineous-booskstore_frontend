"use client";

import { SocialProfile, SocialLoginError } from "./types";

declare global {
  interface Window {
    FB?: {
      login: (
        callback: (response: FbLoginResponse) => void,
        options?: { scope: string }
      ) => void;
      getLoginStatus: (callback: (response: FbLoginStatusResponse) => void) => void;
      api: (path: string, params: { fields: string }, callback: (user: FbUserProfile) => void) => void;
      init: (config: FbInitConfig) => void;
    };
    fbAsyncInit: () => void;
  }
}

interface FbInitConfig {
  appId: string;
  cookie: boolean;
  xfbml: boolean;
  version: string;
}

interface FbLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
  };
}

interface FbLoginStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
  };
}

interface FbUserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

let isInitialized = false;

export const initFacebook = (appId: string, version: string): void => {
  if (typeof window === "undefined" || isInitialized) return;

  window.fbAsyncInit = () => {
    window.FB?.init({
      appId,
      cookie: true,
      xfbml: true,
      version,
    });
    isInitialized = true;
  };

  const script = document.createElement("script");
  script.src = "https://connect.facebook.net/en_US/sdk.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

export const loginWithFacebook = async (): Promise<SocialProfile> => {
  if (!isInitialized || !window.FB) {
    throw { provider: "FACEBOOK", message: "Facebook SDK not loaded" } as SocialLoginError;
  }

  const fb = window.FB;

  return new Promise((resolve, reject) => {
    fb.login(
      async (response) => {
        if (response.status !== "connected" || !response.authResponse) {
          reject({ provider: "FACEBOOK", message: "Login cancelled or failed" } as SocialLoginError);
          return;
        }

        fb.api(
          "/me",
          { fields: "id,email,first_name,last_name,picture" },
          (user: FbUserProfile) => {
            resolve({
              email: user.email,
              providerId: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              avatar: user.picture?.data.url,
            });
          }
        );
      },
      { scope: "email,public_profile" }
    );
  });
};

export const checkFacebookLoginStatus = async (): Promise<FbLoginStatusResponse> => {
  if (!isInitialized || !window.FB) {
    return { status: "unknown" };
  }

  const fb = window.FB;

  return new Promise((resolve) => {
    fb.getLoginStatus((response) => resolve(response));
  });
};
