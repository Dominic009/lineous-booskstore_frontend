"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import { AddressProvider } from "@/contexts/AddressContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { SocialLoginProvider } from "@/contexts/SocialLoginContext";
import { initGoogle, initFacebook, initApple } from "@/lib/social-login";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocialLoginProvider>
          <CartProvider>
            <WishlistProvider>
              <AddressProvider>
                <OrderProvider>
                  <TooltipProvider>
                    <Toaster richColors position="bottom-right" />
                    <CartDrawer />
                    {children}
                  </TooltipProvider>
                </OrderProvider>
              </AddressProvider>
            </WishlistProvider>
          </CartProvider>
        </SocialLoginProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}