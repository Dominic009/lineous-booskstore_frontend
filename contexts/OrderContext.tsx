"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useOrders, useCreateOrder, useDownloadReceipt } from "@/hooks/use-orders";
import { Order } from "@/lib/types";

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (data: { addressId: string; discount?: number; shipping?: number; paymentMethod?: string; notes?: string }) => void;
  isCreating: boolean;
  downloadReceipt: (orderId: string, orderNumber?: string) => void;
  isDownloading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { data: orders = [], isLoading } = useOrders();
  const { mutate: createOrderMutate, isPending: isCreating } = useCreateOrder();
  const { mutate: downloadReceiptMutate, isPending: isDownloading } = useDownloadReceipt();

  const createOrder = (data: { addressId: string; discount?: number; shipping?: number; paymentMethod?: string; notes?: string }) => {
    createOrderMutate(data);
  };

  const downloadReceipt = (orderId: string, orderNumber?: string) => {
    downloadReceiptMutate({ orderId, orderNumber });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        createOrder,
        isCreating,
        downloadReceipt,
        isDownloading,
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