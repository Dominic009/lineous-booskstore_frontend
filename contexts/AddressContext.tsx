"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/use-addresses";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/lib/types";

interface AddressContextType {
  addresses: Address[];
  isLoading: boolean;
  createAddress: (data: Partial<Address>) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { data: addresses = [], isLoading } = useAddresses(user?.id);
  const { mutate: createAddressMutate, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddressMutate, isPending: isUpdating } = useUpdateAddress();
  const { mutate: deleteAddressMutate, isPending: isDeleting } = useDeleteAddress();

  const createAddress = (data: Partial<Address>) => {
    createAddressMutate(data);
  };

  const updateAddress = (id: string, data: Partial<Address>) => {
    updateAddressMutate({ id, data });
  };

  const deleteAddress = (id: string) => {
    deleteAddressMutate(id);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        isLoading,
        createAddress,
        updateAddress,
        deleteAddress,
        isCreating,
        isUpdating,
        isDeleting,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddressContext must be used within an AddressProvider");
  }
  return context;
};