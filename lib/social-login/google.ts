"use client";

import { SocialProfile, SocialLoginError } from "./types";

type GoogleSubscriber = (profile: SocialProfile) => void;
type ErrorSubscriber = (error: SocialLoginError) => void;

const subscribers = new Set<GoogleSubscriber>();
const errorSubscribers = new Set<ErrorSubscriber>();

export const subscribeGoogleAuth = (callback: GoogleSubscriber) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export const subscribeGoogleError = (callback: ErrorSubscriber) => {
  errorSubscribers.add(callback);
  return () => errorSubscribers.delete(callback);
};

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          prompt: (moment?: { notification: string }) => void;
        };
      };
    };
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleCredentialResponse {
  credential: string;
}

let initialized = false;
let promptPending = false;

export const initGoogle = (clientId: string): void => {
  if (typeof window === "undefined") return;

  const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
  if (existingScript) return;

  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        try {
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          const profile: SocialProfile = {
            email: payload.email,
            providerId: payload.sub,
            firstName: payload.given_name || "",
            lastName: payload.family_name || "",
            avatar: payload.picture,
          };
          subscribers.forEach((cb) => cb(profile));
        } catch {
          const error: SocialLoginError = { provider: "GOOGLE", message: "Failed to parse credential" };
          errorSubscribers.forEach((cb) => cb(error));
        }
      },
    });

    initialized = true;

    if (promptPending) {
      window.google.accounts.id.prompt({ notification: "display" });
      promptPending = false;
    }
  };
};

export const promptGoogle = (): void => {
  if (!initialized) {
    promptPending = true;
    return;
  }
  window.google.accounts.id.prompt({ notification: "display" });
};

export const isGoogleInitialized = (): boolean => initialized;
