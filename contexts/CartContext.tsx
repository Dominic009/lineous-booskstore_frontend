"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/AuthContext";
import { Cart, CartItem, BookPaper } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (bookId: string, paperId?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to calculate effective price from paper
function getEffectivePrice(paper: BookPaper | null): number {
  if (!paper) return 0;
  
  // If effectivePrice is provided, use it
  if (paper.effectivePrice !== undefined) {
    return paper.effectivePrice;
  }
  
  // Calculate from price and discount
  const price = typeof paper.price === 'string' ? parseFloat(paper.price) : paper.price;
  const discountPrice = paper.discountPrice 
    ? (typeof paper.discountPrice === 'string' ? parseFloat(paper.discountPrice) : paper.discountPrice)
    : null;
  
  // Check if discount is active
  if (discountPrice && paper.discountStartDate && paper.discountEndDate) {
    const now = new Date();
    const startDate = new Date(paper.discountStartDate);
    const endDate = new Date(paper.discountEndDate);
    if (now >= startDate && now <= endDate) {
      return discountPrice;
    }
  }
  
  return price;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const { data: cart, isLoading } = useCart(user?.id);
  const { mutate: addToCartMutate } = useAddToCart();
  const { mutate: updateCartItemMutate } = useUpdateCartItem();
  const { mutate: removeFromCartMutate } = useRemoveFromCart();
  const { mutate: clearCartMutate } = useClearCart();
  const { mounted } = useAuth();

  const items = cart?.cartItems || [];
  const isCartLoading = isLoading || !mounted;

  const addToCart = (bookId: string, paperId?: string, quantity: number = 1) => {
    addToCartMutate({ bookId, paperId, quantity });
  };

  const removeFromCart = (cartItemId: string) => {
    removeFromCartMutate(cartItemId);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    updateCartItemMutate({ cartItemId, quantity });
  };

  const clearCart = () => {
    clearCartMutate();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + getEffectivePrice(item.paper) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isLoading: isCartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
