"use client";

import { useState, useCallback } from "react";
import { loginWithApple, handleAppleCallback } from "@/lib/social-login";
import { useSocialLoginContext } from "@/contexts/SocialLoginContext";
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
      const message = error instanceof Error ? error.message : "Please try again.";
      toast.error("Apple sign-in failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [authenticate, onSuccess]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <AppleIcon className="w-5 h-5" />
      {isLoading ? "Signing in..." : "Continue with Apple"}
    </button>
  );
}

const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.99-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83.87-.09 1.76-.45 2.61-1-.83 1.24-1.9 2.48-3 3.88zM12.5 2C11.12 2 10 .59 10.59.09c.07-.07.21-.11.35-.03 1.08.62 2.15 1.24 3.06 2.01.25.2.56.07.62-.22.35-1.45.35-2.81-.08-3.77C13.86-.1 12.5-.25 12.5 2z" />
  </svg>
);
