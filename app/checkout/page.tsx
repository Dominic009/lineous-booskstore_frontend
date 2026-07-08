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
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Navbar from "../../components/Navbar";
import { useCartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateOrder } from "../../hooks/use-orders";
import { useAddresses, useCreateAddress } from "../../hooks/use-addresses";
import { BookPaper } from "../../lib/types";

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
  const { data: addresses = [] } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressMode, setAddressMode] = useState<"existing" | "new">("new");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    if (addresses.length > 0) {
      setAddressMode("existing");
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses]);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    addressLine: user?.address || "",
    area: user?.city || "",
    division: "",
    district: "",
    postalCode: "",
    country: user?.country || "",
    phone: user?.phone || "",
  });

  const shippingCost =
    shippingMethod === "express" ? 80 : totalPrice > 1500 ? 0 : 40;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">
        <Navbar />
        <div className="pt-32 text-center relative z-10">
          <h1 className="font-display text-2xl font-bold mb-4 text-white">
            Your cart is empty
          </h1>
          <p className="text-zinc-400 mb-6">
            Add some books to get started!
          </p>
          <Button onClick={() => router.push("/")} className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white border border-violet-400/20 shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60">Browse Books</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      let addressId = selectedAddressId;

      if (addressMode === "new" || !addressId) {
        const savedAddress = await createAddressMutation.mutateAsync({
          name:
            `${formData.firstName} ${formData.lastName}`.trim() ||
            user?.name ||
            "",
          phone: user?.phone || formData.phone,
          country: formData.country || null,
          division: formData.division || null,
          district: formData.district,
          area: formData.area || null,
          addressLine: formData.addressLine,
          postalCode: formData.postalCode || null,
          isDefault: false,
        });
        addressId = savedAddress.id;
      }

      await createOrderMutation.mutateAsync({
        addressId,
        discount: 0,
        shipping: shippingCost,
        paymentMethod,
        notes: "",
      });

      clearCart();
      router.push("/");
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitting =
    isProcessing ||
    createOrderMutation.isPending ||
    createAddressMutation.isPending;

  const steps = [
    { number: 1, label: "Shipping" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review" },
  ];

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">

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
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-violet-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white">
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
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-400/20"
                      : "bg-white/[0.03] text-zinc-500 border border-white/[0.08]"
                  }`}
                >
                  {step > s.number ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    s.number
                  )}
                </div>
                <span
                  className={`ml-2 hidden xs:block ${
                    step >= s.number
                      ? "text-zinc-200"
                      : "text-zinc-500"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-zinc-600 flex-shrink-0" />
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
                <div className="relative rounded-2xl p-6 shadow-xl shadow-black/20 border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.05] via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-white relative z-10">
                    <Truck className="w-5 h-5 text-violet-400" />
                    Shipping Information
                  </h2>

                  {/* Address Mode Toggle */}
                  {addresses.length > 0 && (
                    <RadioGroup
                      value={addressMode}
                      onValueChange={(v) =>
                        setAddressMode(v as "existing" | "new")
                      }
                      className="flex gap-4 mb-6"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="new" className="border-white/[0.15] text-violet-500" />
                        <span className="font-medium text-zinc-300">New Address</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="existing" className="border-white/[0.15] text-violet-500" />
                        <span className="font-medium text-zinc-300">Saved Address</span>
                      </label>
                    </RadioGroup>
                  )}

                  {addressMode === "existing" && addresses.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <Select
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                      >
                        <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:border-white/[0.15]">
                          <SelectValue placeholder="Select a saved address" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a0a0f] border-white/[0.08]">
                          {addresses.map((addr) => (
                            <SelectItem key={addr.id} value={addr.id} className="text-zinc-300 focus:bg-white/[0.05]">
                              {addr.name} — {addr.addressLine}, {addr.district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedAddress && (
                        <div className="p-3 bg-white/[0.03] rounded-lg text-sm text-zinc-400 border border-white/[0.08]">
                          <p className="font-medium text-zinc-200">
                            {selectedAddress.name}
                          </p>
                          <p>{selectedAddress.addressLine}</p>
                          <p>
                            {selectedAddress.district}
                            {selectedAddress.area &&
                              `, ${selectedAddress.area}`}
                          </p>
                          {selectedAddress.country && (
                            <p>
                              {selectedAddress.country}
                              {selectedAddress.postalCode &&
                                ` ${selectedAddress.postalCode}`}
                            </p>
                          )}
                          <p>Phone: {selectedAddress.phone}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {addressMode === "new" && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-zinc-300">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          required
                          className="bg-white/[0.03] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-zinc-300">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          required
                          className="bg-white/[0.03] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-zinc-300">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          className="bg-white/[0.03] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="addressLine" className="text-sm font-medium text-zinc-300">Address Line</Label>
                        <Input
                          id="addressLine"
                          value={formData.addressLine}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              addressLine: e.target.value,
                            })
                          }
                          required
                          className="bg-white/[0.03] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-medium text-zinc-300">District</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              district: e.target.value,
                            })
                          }
                          required
                          className="bg-white/[0.03] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium text-zinc-300">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                          className="bg-white/[0.03] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="my-6 bg-white/[0.08]" />

                  <h3 className="font-semibold mb-4 text-zinc-200">Shipping Method</h3>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-3"
                  >
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-violet-500/30 transition-colors bg-white/[0.02] border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" className="border-white/[0.15] text-violet-500" />
                        <div>
                          <p className="font-medium text-zinc-200">Standard Shipping</p>
                          <p className="text-sm text-zinc-400">
                            5-7 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-violet-300">
                        {totalPrice > 1500 ? "Free" : "৳40"}
                      </span>
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-violet-500/30 transition-colors bg-white/[0.02] border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" className="border-white/[0.15] text-violet-500" />
                        <div>
                          <p className="font-medium text-zinc-200">Express Shipping</p>
                          <p className="text-sm text-zinc-400">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-violet-300">৳80</span>
                    </label>
                  </RadioGroup>

                  <Button
                    className="w-full mt-6 active:scale-95 transition-transform bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl border border-violet-400/20 shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60"
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                 </Button>
                </div>
              )}

               {/* Step 2: Payment */}
               {step === 2 && (
                <div className="relative rounded-2xl p-6 shadow-xl shadow-black/20 border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.05] via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-white relative z-10">
                    <CreditCard className="w-5 h-5 text-violet-400" />
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3 mb-6"
                  >
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-500/30 transition-colors bg-white/[0.02] border-white/[0.08]">
                      <RadioGroupItem value="COD" className="border-white/[0.15] text-violet-500" />
                      <CreditCard className="w-5 h-5 text-violet-400" />
                      <span className="font-medium text-zinc-200">Cash on Delivery</span>
                    </label>
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="active:scale-95 transition-transform bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] hover:border-white/[0.15]"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 active:scale-95 transition-transform bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl border border-violet-400/20 shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60"
                      onClick={() => setStep(3)}
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="relative rounded-2xl p-6 shadow-xl shadow-black/20 border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/[0.05] via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-white relative z-10">
                    <Check className="w-5 h-5 text-amber-400" />
                    Review Your Order
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                      <h3 className="font-semibold mb-2 text-zinc-200">Shipping Address</h3>
                      {selectedAddress ? (
                        <p className="text-zinc-400">
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
                        <p className="text-zinc-400">
                          {formData.firstName} {formData.lastName}
                          <br />
                          {formData.addressLine}
                          <br />
                          {formData.district}
                          {formData.area && `, ${formData.area}`}
                          <br />
                          {formData.country}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                      <h3 className="font-semibold mb-2 text-zinc-200">Payment Method</h3>
                      <p className="text-zinc-400">
                        {paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-xl mb-6 border border-amber-500/20">
                    <Lock className="w-5 h-5 text-amber-400" />
                    <p className="text-sm text-zinc-300">
                      Your payment information is secure and encrypted
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="active:scale-95 transition-transform bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] hover:border-white/[0.15]"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 active:scale-95 transition-transform bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl border border-violet-400/20 shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : `Place Order - ৳${finalTotal}`}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="relative rounded-2xl p-6 shadow-xl shadow-black/20 border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl sticky top-24">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.05] via-transparent to-transparent rounded-2xl pointer-events-none" />
                <h2 className="font-display text-xl font-semibold mb-6 text-white relative z-10">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.paper?.thumbnail || item.book.thumbnail}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded-lg border border-white/[0.08]"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1 text-zinc-200">
                          {item.book.title}
                        </h3>
                        {item.paper && (
                          <p className="text-sm text-violet-300 font-medium">
                            {item.paper.name}
                          </p>
                        )}
                        <p className="text-sm text-zinc-400">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-violet-300">
                          ৳{getEffectivePrice(item.paper) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="font-medium text-zinc-200">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Shipping</span>
                    <span className="font-medium text-zinc-200">
                      {shippingCost === 0 ? "Free" : `৳${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-zinc-200">Total</span>
                    <span className="text-violet-300">
                      ৳{finalTotal.toFixed(2)}
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
