"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useOrders, useCreateOrder } from "@/hooks/use-orders";
import { Order } from "@/lib/types";

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (data: { addressId: string; discount?: number; shipping?: number; paymentMethod?: string; notes?: string }) => void;
  isCreating: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { data: orders = [], isLoading } = useOrders();
  const { mutate: createOrderMutate, isPending: isCreating } = useCreateOrder();

  const createOrder = (data: { addressId: string; discount?: number; shipping?: number; paymentMethod?: string; notes?: string }) => {
    createOrderMutate(data);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        createOrder,
        isCreating,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};