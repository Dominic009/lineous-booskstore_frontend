"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/contexts/AuthContext";
import { WishlistItem } from "@/lib/types";

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (bookId: string) => void;
  removeFromWishlist: (bookId: string) => void;
  isAdding: boolean;
  isRemoving: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useWishlist(user?.id);
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } = useRemoveFromWishlist();

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isAdding,
        isRemoving,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return context;
};