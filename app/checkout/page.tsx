"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Lock,
  Check,
  ChevronRight,
  MapPin,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";

import Navbar from "../../components/Navbar";
import { useCartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateOrder } from "../../hooks/use-orders";
import { useAddresses } from "../../hooks/use-addresses";
import { AddressFormDialog } from "@/components/AddressFormDialog";
import { BookPaper, Address } from "../../lib/types";
import { toast } from "sonner";

// Helper to calculate effective price from paper
function getEffectivePrice(paper: BookPaper | null): number {
  if (!paper) return 0;

  // If effectivePrice is provided, use it
  if (paper.effectivePrice !== undefined) {
    return paper.effectivePrice;
  }

  // Calculate from price and discount
  const price =
    typeof paper.price === "string" ? parseFloat(paper.price) : paper.price;
  const discountPrice = paper.discountPrice
    ? typeof paper.discountPrice === "string"
      ? parseFloat(paper.discountPrice)
      : paper.discountPrice
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

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCartContext();
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newlyCreatedAddress, setNewlyCreatedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || newlyCreatedAddress;


  if (items.length === 0) {
    return (
      <div className="relative min-h-screen bg-background overflow-hidden">
        <Navbar />
        <div className="pt-32 text-center relative z-10">
          <h1 className="font-display text-2xl font-bold mb-4 text-heading">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Add some books to get started!
          </p>
          <Button onClick={() => router.push("/")} className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30">Browse Books</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      if (!selectedAddressId) {
        toast.error("Please select or create an address");
        return;
      }

      const order = await createOrderMutation.mutateAsync({
        addressId: selectedAddressId,
        discount: 0,
        paymentMethod,
        notes: "",
      });

      clearCart();
      router.push(`/orders/success?orderId=${order.id}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitting = isProcessing || createOrderMutation.isPending;

  const handleAddressCreated = (address?: Address) => {
    if (address) {
      setNewlyCreatedAddress(address);
      setSelectedAddressId(address.id);
    }
  };

  const steps = [
    { number: 1, label: "Shipping" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-heading">
              Checkout
            </h1>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 overflow-x-auto py-2"
          >
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
                    step >= s.number
                      ? "bg-accent text-white shadow-lg shadow-primary/20 border border-primary/20"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {step > s.number ? (
                    <Check className="w-4 h-4 sm:w-5 sm:w-5" />
                  ) : (
                    s.number
                  )}
                </div>
                <span
                  className={`ml-2 hidden xs:block ${
                    step >= s.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-slate-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="relative rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-border bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-heading relative z-10">
                    <Truck className="w-5 h-5 text-primary" />
                    Shipping Information
                  </h2>

                  {/* Select Address Section */}
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2 text-heading">
                    <MapPin className="w-5 h-5 text-primary" />
                    Select an address
                  </h3>

                  {addressesLoading ? (
                    <div className="space-y-3 mb-6">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-muted rounded-xl" />
                        </div>
                      ))}
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-3 mb-6">
                      {addresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                            selectedAddressId === addr.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <MapPin
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              selectedAddressId === addr.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{addr.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {addr.addressLine}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {addr.district}
                              {addr.area && `, ${addr.area}`}
                            </p>
                            {addr.country && (
                              <p className="text-sm text-muted-foreground">
                                {addr.country}
                                {addr.postalCode && ` ${addr.postalCode}`}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Phone: {addr.phone}
                            </p>
                          </div>
                          {selectedAddressId === addr.id && (
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-xl border-2 border-dashed border-border mb-6">
                      <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No saved addresses yet</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Create New Address
                    </span>
                    <Plus className="w-4 h-4" />
                  </Button>

                  <Separator className="my-6 bg-border" />

                  <h3 className="font-semibold mb-4 text-foreground">Shipping Method</h3>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-3"
                  >
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary/40 transition-colors bg-card border-border">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" className="border-border text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Standard Shipping</p>
                          <p className="text-sm text-muted-foreground">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        Delivery charge will depend on your location
                      </span>
                    </label>
                    {/* <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary/40 transition-colors bg-card border-border">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" className="border-border text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Express Shipping</p>
                          <p className="text-sm text-muted-foreground">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        Delivery charge will depend on your location
                      </span>
                    </label> */}
                  </RadioGroup>

                  <Button
                    className="w-full mt-6 active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer "
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                 </Button>
                </div>
              )}

               {/* Step 2: Payment */}
               {step === 2 && (
                <div className="relative rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-border bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-heading relative z-10">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3 mb-6"
                  >
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-primary/40 transition-colors bg-card border-border">
                      <RadioGroupItem value="COD" className="border-border text-primary" />
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Cash on Delivery</span>
                    </label>
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="active:scale-95 transition-transform bg-card border-border text-body hover:bg-muted hover:border-primary/40"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-semibold rounded-xl border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                      onClick={() => setStep(3)}
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="relative rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-border bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-heading relative z-10">
                    <Check className="w-5 h-5 text-accent" />
                    Review Your Order
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-muted rounded-xl border border-border">
                      <h3 className="font-semibold mb-2 text-foreground">Shipping Address</h3>
                      {selectedAddress ? (
                        <p className="text-muted-foreground">
                          {selectedAddress.name}
                          <br />
                          {selectedAddress.addressLine}
                          <br />
                          {selectedAddress.district}
                          {selectedAddress.area && `, ${selectedAddress.area}`}
                          <br />
                          {selectedAddress.country && (
                            <>
                              {selectedAddress.country}
                              {selectedAddress.postalCode &&
                                ` ${selectedAddress.postalCode}`}
                            </>
                          )}
                          <br />
                          Phone: {selectedAddress.phone}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          No address selected
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-muted rounded-xl border border-border">
                      <h3 className="font-semibold mb-2 text-foreground">Payment Method</h3>
                      <p className="text-muted-foreground">
                        {paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-xl mb-6 border border-accent/20">
                    <Lock className="w-5 h-5 text-accent" />
                    <p className="text-sm text-body">
                      Your payment information is secure and encrypted
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="active:scale-95 transition-transform bg-card border-border text-body hover:bg-muted hover:border-primary/40"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            <AddressFormDialog
              open={isAddressDialogOpen}
              onOpenChange={setIsAddressDialogOpen}
              onSuccess={handleAddressCreated}
            />

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="relative rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-border bg-card sticky top-24">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent rounded-2xl pointer-events-none" />
                <h2 className="font-display text-xl font-semibold mb-6 text-heading relative z-10">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.paper?.thumbnail || item.book.thumbnail}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded-lg border border-border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1 text-foreground">
                          {item.book.title}
                        </h3>
                        {item.paper && (
                          <p className="text-sm text-primary font-medium">
                            {item.paper.name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-primary">
                          ৳{getEffectivePrice(item.paper) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">
                      Delivery charge will depend on your location
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">৳{tax.toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">
                      ৳{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
