Dinner# Social Login Implementation Plan

## Overview

Integrate Google, Facebook, and Apple social login into the existing Next.js customer frontend using the client-side approach. The backend endpoint `/api/auth/social-login` is ready and returns `{ accessToken, user }` — same shape as existing login/register.

**Architecture:**

```
User clicks social login button
        │
        ▼
Provider SDK (Google / Facebook / Apple)
        │
        ▼
client gets OAuth profile (email, id, name, picture)
        │
        ▼
useSocialLogin hook ──► POST /auth/social-login
        │                        │
        │                        ▼
        │                Backend creates/links user
        │                Returns JWT + user object
        ▼
AuthContext updates user + token
        │
        ▼
Everything else works unchanged
```

---

## Prerequisites

- Backend `/auth/social-login` endpoint is live
- Existing `AuthContext`, `use-auth.ts`, `api-client.ts` remain untouched
- Next.js App Router with `"use client"` components

---

## Step 1: Environment Variables

Add these to `.env` at the root of the project:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_FACEBOOK_VERSION=v18.0

# Apple OAuth
NEXT_PUBLIC_APPLE_CLIENT_ID=your_apple_service_id
NEXT_PUBLIC_APPLE_TEAM_ID=your_team_id
NEXT_PUBLIC_APPLE_KEY_ID=your_key_id
NEXT_PUBLIC_APPLE_PRIVATE_KEY=your_private_key_content
```

**Notes:**
- Prefix with `NEXT_PUBLIC_` because these are accessed in client components
- Apple private key goes in env (`.p8` content as string)
- Google/Facebook IDs are safe to expose client-side
- Do NOT commit real secrets to version control

---

## Step 2: Create Hook (`hooks/use-social-login.ts`)

Mirrors `useLogin`/`useRegister` pattern exactly.

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, setToken } from "@/lib/api-client";
import { AuthResponse, AuthUser } from "@/lib/types";

export type SocialProvider = "GOOGLE" | "FACEBOOK" | "APPLE";

interface SocialLoginPayload {
  email: string;
  provider: SocialProvider;
  providerId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface SocialLoginResult extends AuthResponse {
  isNewUser?: boolean;
}

export const useSocialLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<SocialLoginResult, Error, SocialLoginPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<AuthResponse>("/auth/social-login", payload);
      return response as unknown as SocialLoginResult;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(["user"], data.user);
    },
  });
};
```

**Why this is modular:**
- Single responsibility: only handles social login API call
- Reuses existing `apiClient` and `setToken`
- Type-safe with `SocialProvider` union
- Extends `AuthResponse` with `isNewUser` flag if backend sends it

---

## Step 3: Update `AuthContext` (`contexts/AuthContext.tsx`)

Add a single `socialLogin` method alongside existing `login`, `register`, `logout`.

```ts
const socialLoginMutation = useSocialLogin();

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
```

Add to context value:

```ts
value={{
  user,
  isAuthenticated: !!user,
  login,
  register,
  logout,
  updateProfile,
  socialLogin,   // <-- new
}}
```

**Why this is modular:**
- No new context file needed
- Reuses `setUser` and `setToken` already present
- Consistent with login/register shape
- Downstream consumers see one unified auth API

---

## Step 4: Create Provider SDK Wrappers (`lib/social-login/`)

Create this folder to isolate all provider-specific logic.

```
lib/social-login/
├── index.ts
├── types.ts
├── google.ts
├── facebook.ts
└── apple.ts
```

### `lib/social-login/types.ts`

```ts
export interface SocialProfile {
  email: string;
  providerId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface SocialLoginError {
  provider: string;
  message: string;
}
```

### `lib/social-login/google.ts`

```ts
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
```

### `lib/social-login/facebook.ts`

```ts
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
      api: (path: string, params: unknown, callback: (user: FbUserProfile) => void) => void;
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

  return new Promise((resolve, reject) => {
    window.FB.login(
      async (response) => {
        if (response.status !== "connected" || !response.authResponse) {
          reject({ provider: "FACEBOOK", message: "Login cancelled or failed" } as SocialLoginError);
          return;
        }

        window.FB.api(
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

export const checkFacebookLoginStatus = async (): Promise<FbLoginResponse> => {
  if (!isInitialized || !window.FB) {
    return { status: "unknown" };
  }

  return new Promise((resolve) => {
    window.FB.getLoginStatus((response) => resolve(response));
  });
};
```

### `lib/social-login/apple.ts`

```ts
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

interface AppleAuthConfig {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
  redirectURI: string;
  scope: string;
  state: string;
}

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
```

### `lib/social-login/index.ts`

```ts
export { initGoogle, promptGoogle, isGoogleInitialized, subscribeGoogleAuth, subscribeGoogleError } from "./google";
export { initFacebook, loginWithFacebook, checkFacebookLoginStatus } from "./facebook";
export { initApple, loginWithApple, handleAppleCallback } from "./apple";
export type { SocialProfile, SocialLoginError } from "./types";
```

**Why this is modular:**
- Each provider is isolated — easy to add/remove providers
- Type-safe with shared `SocialProfile` interface
- Handles loading/unloading SDK scripts automatically
- No props drilling or context pollution
- Subscribe pattern lets buttons decouple from SDK glue code

---

## Step 5: Initialize SDKs in Root Layout

Load social login SDKs once when the app starts.

```tsx
// app/providers.tsx
"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } "next-themes";
import {
  initGoogle,
  initFacebook,
  initApple,
} from "@/lib/social-login";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initGoogle(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!);
    initFacebook(
      process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
      process.env.NEXT_PUBLIC_FACEBOOK_VERSION!,
    );

    if (process.env.NEXT_PUBLIC_APPLE_CLIENT_ID) {
      initApple({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
        teamId: process.env.NEXT_PUBLIC_APPLE_TEAM_ID!,
        keyId: process.env.NEXT_PUBLIC_APPLE_KEY_ID!,
        privateKey: process.env.NEXT_PUBLIC_APPLE_PRIVATE_KEY!,
        redirectUri: typeof window !== "undefined"
          ? `${window.location.origin}/api/auth/callback/apple`
          : "",
      });
    }
  }, []);

  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

**Why this is modular:**
- All SDK init in one place
- Lives outside component tree, so it runs once
- Clean separation from UI concerns
- Easy to disable providers by commenting one line

---

## Step 6: Create Reusable Social Button Components

Create `components/social-login/` folder.

```
components/social-login/
├── index.ts
├── GoogleButton.tsx
├── FacebookButton.tsx
└── AppleButton.tsx
```

### `components/social-login/GoogleButton.tsx`

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { promptGoogle, subscribeGoogleAuth, subscribeGoogleError } from "@/lib/social-login";
import { SocialLoginError } from "@/lib/social-login";
import { useSocialLoginContext } from "@/contexts/SocialLoginContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GoogleButton({
  onSuccess,
  className = "",
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useSocialLoginContext();

  useEffect(() => {
    const unsub = subscribeGoogleAuth(async (profile) => {
      setIsLoading(true);
      try {
        await authenticate({ ...profile, provider: "GOOGLE" });
        toast.success("Welcome!", { description: "Signed in with Google." });
        onSuccess?.();
      } catch {
        toast.error("Sign-in failed", { description: "Please try again." });
      } finally {
        setIsLoading(false);
      }
    });

    const unsubError = subscribeGoogleError((error: SocialLoginError) => {
      toast.error(error.message || "Google sign-in failed", { description: "Please try again." });
    });

    return () => {
      unsub();
      unsubError();
    };
  }, [authenticate, onSuccess]);

  const handleClick = useCallback(() => {
    promptGoogle();
  }, []);

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full ${className}`}
      variant="outline"
    >
      <GoogleIcon className="w-5 h-5 mr-2" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.02 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.98 2.18 7.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);
```

### `components/social-login/FacebookButton.tsx`

```tsx
"use client";

import { useState, useCallback } from "react";
import { loginWithFacebook } from "@/lib/social-login";
import { SocialLoginError } from "@/lib/social-login";
import { useSocialLoginContext } from "@/contexts/SocialLoginContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FacebookButton({
  onSuccess,
  className = "",
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useSocialLoginContext();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await loginWithFacebook();
      await authenticate({ ...profile, provider: "FACEBOOK" });
      toast.success("Welcome!", { description: "Signed in with Facebook." });
      onSuccess?.();
    } catch (error) {
      toast.error("Facebook sign-in failed", {
        description: error instanceof Error ? (error as SocialLoginError).message || "Please try again." : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [authenticate, onSuccess]);

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white ${className}`}
    >
      <FacebookIcon className="w-5 h-5 mr-2" />
      {isLoading ? "Signing in..." : "Continue with Facebook"}
    </Button>
  );
};

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
```

### `components/social-login/AppleButton.tsx`

```tsx
"use client";

import { useState, useCallback } from "react";
import { loginWithApple, handleAppleCallback } from "@/lib/social-login";
import { SocialLoginError } from "@/lib/social-login";
import { useSocialLoginContext } from "@/contexts/SocialLoginContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AppleButton({
  onSuccess,
  className = "",
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useSocialLoginContext();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const authState = await loginWithApple();
      const profile = handleAppleCallback(authState);
      await authenticate({ ...profile, provider: "APPLE" });
      toast.success("Welcome!", { description: "Signed in with Apple." });
      onSuccess?.();
    } catch (error) {
      toast.error("Apple sign-in failed", {
        description: error instanceof Error ? (error as SocialLoginError).message || "Please try again." : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [authenticate, onSuccess]);

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full bg-black hover:bg-black/90 text-white ${className}`}
    >
      <AppleIcon className="w-5 h-5 mr-2" />
      {isLoading ? "Signing in..." : "Continue with Apple"}
    </Button>
  );
};

const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.99-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83.87-.09 1.76-.45 2.61-1-.83 1.24-1.9 2.48-3 3.88zM12.5 2C11.12 2 10 .59 10.59.09c.07-.07.21-.11.35-.03 1.08.62 2.15 1.24 3.06 2.01.25.2.56.07.62-.22.35-1.45.35-2.81-.08-3.77C13.86-.1 12.5-.25 12.5 2z" />
  </svg>
);
```

---

## Step 7: Create `SocialLoginContext` (`contexts/SocialLoginContext.tsx`)

Coordinates SDK profile + existing auth flow.

```ts
"use client";

import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { useSocialLogin } from "@/hooks/use-social-login";
import { useAuth } from "./AuthContext";
import { SocialProfile, SocialLoginError } from "@/lib/social-login";

const SocialLoginContext = createContext<{
  authenticate: (profile: SocialProfile & { provider: "GOOGLE" | "FACEBOOK" | "APPLE" }) => Promise<void>;
} | null>(null);

export const SocialLoginProvider = ({ children }: { children: ReactNode }) => {
  const socialLoginMutation = useSocialLogin();
  const { socialLogin } = useAuth();

  const authenticate = useCallback(
    async (profile: SocialProfile & { provider: "GOOGLE" | "FACEBOOK" | "APPLE" }) => {
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
    throw new Error("useSocialLoginContext must be used within SocialLoginProvider");
  }
  return context;
};
```

**Why this is modular:**
- Single entry point from any button
- Keeps SDK details out of UI components
- Easy to test by mocking `useSocialLogin`

---

## Step 8: Update `app/providers.tsx`

Wrap children with `SocialLoginProvider`.

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocialLoginProvider } from "@/contexts/SocialLoginContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocialLoginProvider>
            {children}
          </SocialLoginProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

---

## Step 9: Update Login Page (`app/login/page.tsx`)

Add social login buttons near the top of the form (above email/password fields).

```tsx
"use client";

import { GoogleButton } from "@/components/social-login/GoogleButton";
import { FacebookButton } from "@/components/social-login/FacebookButton";
import { AppleButton } from "@/components/social-login/AppleButton";

// Inside the component JSX, add before the form:
<div className="space-y-3">
  <GoogleButton onSuccess={() => router.push("/")} />
  <FacebookButton onSuccess={() => router.push("/")} />
  <AppleButton onSuccess={() => router.push("/")} />
</div>

<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
  </div>
</div>
```

**Why this is modular:**
- Buttons are self-contained
- `onSuccess` callback handles redirect
- Divider clearly separates social from email flow

---

## Step 10: Update `AuthContext` to Include `socialLogin`

In `contexts/AuthContext.tsx`, add:

1. Import `useSocialLogin` and `SocialProvider`
2. Create `socialLoginMutation`
3. Create `socialLogin` callback (see Step 3)
4. Add to context value

---

## What Stays Exactly the Same

| Component | Change Required |
|-----------|----------------|
| `lib/api-client.ts` | None — `Authorization` header is automatic |
| `AuthContext` consumer code | None — `isAuthenticated`, `user`, `logout` work as-is |
| Route protection | None — same `useAuth()` / token-based checks |
| `localStorage` token | None — `setToken()` is reused |
| Logout | None — `removeToken()` clears everything |
| `/auth/social-login` backend | None — backend already ready |

---

## Key Considerations

1. **Name splitting**: OAuth providers give `name` or `given_name`/`family_name`. Backend expects `firstName` and `lastName` separately, so split on the frontend.

2. **Provider enum values**: Backend expects exactly `GOOGLE`, `FACEBOOK`, `APPLE` — not lowercase variants.

3. **Avatar fallback**: Some providers may not return a picture. Handle `undefined` gracefully.

4. **Error handling**: Backend rejects if email is invalid or provider credentials fail. Surface these through the existing toast pattern in `LoginPage`.

5. **SSR/Hydration**: Social login is client-only (SDKs run in browser). Everything is in `"use client"` components — no server component changes needed.

6. **Apple flow**: Apple redirects away and back. The `initApple` config must include a redirect URI the app owns.

7. **Loading states**: Each button manages its own `isLoading` state. Disable button during mutation to prevent double-clicks.

---

## File Reference Summary

| New File | Purpose |
|----------|---------|
| `hooks/use-social-login.ts` | Mutation hook calling `/auth/social-login` |
| `lib/social-login/types.ts` | Shared `SocialProfile` / `SocialLoginError` types |
| `lib/social-login/google.ts` | Google GIS SDK wrapper |
| `lib/social-login/facebook.ts` | Facebook JS SDK wrapper |
| `lib/social-login/apple.ts` | Apple Sign-In JS SDK wrapper |
| `lib/social-login/index.ts` | Barrel export |
| `contexts/SocialLoginContext.tsx` | Coordinates SDK profile → backend → `AuthContext` |
| `components/social-login/GoogleButton.tsx` | Google login button |
| `components/social-login/FacebookButton.tsx` | Facebook login button |
| `components/social-login/AppleButton.tsx` | Apple login button |

| Modified File | Change |
|---------------|--------|
| `contexts/AuthContext.tsx` | Add `socialLogin` method and `useSocialLogin` import |
| `app/providers.tsx` | Add `SocialLoginProvider` wrapper |

---

## Summary

Your backend does all the heavy lifting (user creation/linking, JWT signing, validation). The frontend needs:
- 1 new hook (`use-social-login.ts`)
- 1 new context (`SocialLoginContext.tsx`)
- 3 SDK wrappers (`google.ts`, `facebook.ts`, `apple.ts`)
- 3 button components
- 1 new method in `AuthContext`
- UI buttons on the login page
- 7 env variables

Everything else flows through your existing auth pipeline without modification.
