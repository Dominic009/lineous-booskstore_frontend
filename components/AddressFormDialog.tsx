"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateAddress, useUpdateAddress } from "@/hooks/use-addresses";
import { Address } from "@/lib/types";
import { toast } from "sonner";

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAddress?: Address | null;
  onSuccess?: (address?: Address) => void;
}

export const AddressFormDialog = ({
  open,
  onOpenChange,
  initialAddress,
  onSuccess,
}: AddressFormDialogProps) => {
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    country: "",
    division: "",
    district: "",
    area: "",
    addressLine: "",
    postalCode: "",
    isDefault: false,
  });

  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();

  useEffect(() => {
    if (open) {
      if (initialAddress) {
        setAddressForm({
          name: initialAddress.name,
          phone: initialAddress.phone,
          country: initialAddress.country || "",
          division: initialAddress.division || "",
          district: initialAddress.district,
          area: initialAddress.area || "",
          addressLine: initialAddress.addressLine,
          postalCode: initialAddress.postalCode || "",
          isDefault: initialAddress.isDefault,
        });
      } else {
        setAddressForm({
          name: "",
          phone: "",
          country: "",
          division: "",
          district: "",
          area: "",
          addressLine: "",
          postalCode: "",
          isDefault: false,
        });
      }
    }
  }, [open, initialAddress?.id]);

  const handleSubmit = async () => {
    try {
      let savedAddress: Address;
      if (initialAddress) {
        savedAddress = await updateAddressMutation.mutateAsync({
          id: initialAddress.id,
          data: addressForm,
        });
      } else {
        savedAddress = await createAddressMutation.mutateAsync(addressForm);
      }
      onOpenChange(false);
      onSuccess?.(savedAddress);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save address");
    }
  };

  const isPending = createAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {initialAddress
              ? "Update your address details below."
              : "Fill in the details to add a new address."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addr-name">Full Name</Label>
              <Input
                id="addr-name"
                value={addressForm.name}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-phone">Phone Number</Label>
              <Input
                id="addr-phone"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addr-country">Country</Label>
              <Input
                id="addr-country"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
                placeholder="Enter country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-division">Division</Label>
              <Input
                id="addr-division"
                value={addressForm.division}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, division: e.target.value })
                }
                placeholder="Enter division"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addr-district">District</Label>
              <Input
                id="addr-district"
                value={addressForm.district}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, district: e.target.value })
                }
                placeholder="Enter district"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-area">Area</Label>
              <Input
                id="addr-area"
                value={addressForm.area}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, area: e.target.value })
                }
                placeholder="Enter area"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-line">Address Line</Label>
            <Textarea
              id="addr-line"
              value={addressForm.addressLine}
              onChange={(e) =>
                setAddressForm({ ...addressForm, addressLine: e.target.value })
              }
              placeholder="Enter full address"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addr-postal">Postal Code</Label>
              <Input
                id="addr-postal"
                value={addressForm.postalCode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postalCode: e.target.value })
                }
                placeholder="Enter postal code"
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="addr-default"
                  checked={addressForm.isDefault}
                  onCheckedChange={(checked) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="addr-default"
                  className="text-sm font-medium cursor-pointer"
                >
                  Set as default address
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending ? "Saving..." : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
