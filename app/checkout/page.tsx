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
      <div className="relative min-h-screen bg-white overflow-hidden">
        <Navbar />
        <div className="pt-32 text-center relative z-10">
          <h1 className="font-display text-2xl font-bold mb-4 text-slate-900">
            Your cart is empty
          </h1>
          <p className="text-slate-500 mb-6">
            Add some books to get started!
          </p>
          <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100">Browse Books</Button>
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

      const order = await createOrderMutation.mutateAsync({
        addressId,
        discount: 0,
        shipping: shippingCost,
        paymentMethod,
        notes: "",
      });

      clearCart();
      router.push(`/orders/success?orderId=${order.id}`);
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
    <div className="relative min-h-screen bg-white overflow-hidden">

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
              className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">
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
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-100 border border-violet-500/20"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
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
                      ? "text-slate-900"
                      : "text-slate-500"
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
                <div className="relative rounded-2xl p-6 shadow-sm border border-slate-200 bg-white">
                  <div className="absolute inset-0  rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900 relative z-10">
                    <Truck className="w-5 h-5 text-violet-600" />
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
                        <RadioGroupItem value="new" className="border-slate-300 text-violet-600" />
                        <span className="font-medium text-slate-700">New Address</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="existing" className="border-slate-300 text-violet-600" />
                        <span className="font-medium text-slate-700">Saved Address</span>
                      </label>
                    </RadioGroup>
                  )}

                  {addressMode === "existing" && addresses.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <Select
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                      >
                        <SelectTrigger className="bg-white border-slate-200 text-slate-900 hover:border-slate-300">
                          <SelectValue placeholder="Select a saved address" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200">
                          {addresses.map((addr) => (
                            <SelectItem key={addr.id} value={addr.id} className="text-slate-700 focus:bg-slate-100">
                              {addr.name} — {addr.addressLine}, {addr.district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedAddress && (
                        <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-500 border border-slate-200">
                          <p className="font-medium text-slate-900">
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
                        <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</Label>
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
                          className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</Label>
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
                          className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</Label>
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
                          className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="addressLine" className="text-sm font-medium text-slate-700">Address Line</Label>
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
                          className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-medium text-slate-700">District</Label>
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
                          className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium text-slate-700">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                          className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="my-6 bg-slate-200" />

                  <h3 className="font-semibold mb-4 text-slate-900">Shipping Method</h3>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-3"
                  >
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors bg-white border-slate-200">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" className="border-slate-300 text-violet-600" />
                        <div>
                          <p className="font-medium text-slate-900">Standard Shipping</p>
                          <p className="text-sm text-slate-500">
                            5-7 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-violet-700">
                        {totalPrice > 1500 ? "Free" : "৳40"}
                      </span>
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors bg-white border-slate-200">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" className="border-slate-300 text-violet-600" />
                        <div>
                          <p className="font-medium text-slate-900">Express Shipping</p>
                          <p className="text-sm text-slate-500">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-violet-700">৳80</span>
                    </label>
                  </RadioGroup>

                  <Button
                    className="w-full mt-6 active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl border border-orange-500/20 shadow-lg shadow-orange-100"
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                 </Button>
                </div>
              )}

               {/* Step 2: Payment */}
               {step === 2 && (
                <div className="relative rounded-2xl p-6 shadow-sm border border-slate-200 bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-transparent rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900 relative z-10">
                    <CreditCard className="w-5 h-5 text-violet-600" />
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3 mb-6"
                  >
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors bg-white border-slate-200">
                      <RadioGroupItem value="COD" className="border-slate-300 text-violet-600" />
                      <CreditCard className="w-5 h-5 text-violet-600" />
                      <span className="font-medium text-slate-900">Cash on Delivery</span>
                    </label>
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="active:scale-95 transition-transform bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 active:scale-95 transition-transform bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl border border-violet-500/20 shadow-lg shadow-violet-100"
                      onClick={() => setStep(3)}
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="relative rounded-2xl p-6 shadow-sm border border-slate-200 bg-white">
                  <div className="absolute inset-0  rounded-2xl pointer-events-none" />
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900 relative z-10">
                    <Check className="w-5 h-5 text-amber-600" />
                    Review Your Order
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="font-semibold mb-2 text-slate-900">Shipping Address</h3>
                      {selectedAddress ? (
                        <p className="text-slate-500">
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
                        <p className="text-slate-500">
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

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="font-semibold mb-2 text-slate-900">Payment Method</h3>
                      <p className="text-slate-500">
                        {paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-xl mb-6 border border-amber-200">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <p className="text-sm text-slate-600">
                      Your payment information is secure and encrypted
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="active:scale-95 transition-transform bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 active:scale-95 transition-transform bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl border border-violet-500/20 shadow-lg shadow-violet-100"
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
              <div className="relative rounded-2xl p-6 shadow-sm border border-slate-200 bg-white sticky top-24">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-transparent to-transparent rounded-2xl pointer-events-none" />
                <h2 className="font-display text-xl font-semibold mb-6 text-slate-900 relative z-10">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.paper?.thumbnail || item.book.thumbnail}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1 text-slate-900">
                          {item.book.title}
                        </h3>
                        {item.paper && (
                          <p className="text-sm text-violet-700 font-medium">
                            {item.paper.name}
                          </p>
                        )}
                        <p className="text-sm text-slate-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-violet-700">
                          ৳{getEffectivePrice(item.paper) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium text-slate-900">
                      {shippingCost === 0 ? "Free" : `৳${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-violet-700">
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
