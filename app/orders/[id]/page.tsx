"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Calendar,
  MapPin,
  Download,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { useAuth } from "../../../contexts/AuthContext";
import { useOrder } from "../../../hooks/use-orders";
import { useOrderContext } from "../../../contexts/OrderContext";

// Helper to parse price values (string or number)
const parsePrice = (value: string | number): number => {
  return typeof value === "string" ? parseFloat(value) : value;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PROCESSING":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    case "RETURNED":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getPaymentColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";
    case "REFUNDED":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const OrderDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: order, isLoading, error } = useOrder(id);
  const { downloadReceipt, isDownloading } = useOrderContext();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6">
              <div className="h-7 bg-slate-200 rounded w-48 animate-pulse mb-6" />
              <div className="space-y-4">
                <div className="h-5 bg-slate-100 rounded w-full animate-pulse" />
                <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse" />
                <div className="h-5 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-3 text-slate-900">
              Order not found
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              We could not find the order your looking for.
            </p>
            <Button
              onClick={() => router.push("/orders")}
              size="lg"
              className="active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Back to Orders
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-50 rounded-xl">
                  <Package className="w-8 h-8 text-violet-600" />
                </div>
                <div>
                  <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">
                    Order #{order.orderNumber}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => downloadReceipt(order.id, order.orderNumber)}
                disabled={isDownloading}
                className="active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Preparing..." : "Download Receipt"}
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentColor(
                      order.paymentStatus
                    )}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                    Items
                  </h2>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {item.bookTitle}
                          </p>
                          {item.paperName && (
                            <p className="text-sm text-violet-700 font-medium mt-1">
                              {item.paperName}
                            </p>
                          )}
                          <p className="text-sm text-slate-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-violet-700 text-lg">
                            ৳{parsePrice(item.subtotal).toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-500">
                            ৳{parsePrice(item.paperPrice).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              {order.address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-violet-600" />
                      Shipping Address
                    </h2>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p className="font-medium text-slate-900">
                        {order.address.name}
                      </p>
                      <p>{order.address.addressLine}</p>
                      <p>
                        {order.address.district}
                        {order.address.phone && `, ${order.address.phone}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Payments */}
              {order.payments && order.payments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-violet-600" />
                      Payments
                    </h2>
                    <div className="space-y-3">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 bg-slate-50 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-900">
                              {payment.gateway}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Amount</span>
                            <span className="font-semibold text-slate-900">
                              ৳{parsePrice(payment.amount).toFixed(2)}{" "}
                              {payment.currency}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-24"
              >
                <div className="p-6">
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                    Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-900">
                        ৳{parsePrice(order.subtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-400" />
                        Shipping
                      </span>
                      <span className="font-medium text-slate-900">
                        ৳{parsePrice(order.shipping).toFixed(2)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-violet-700">
                        ৳{parsePrice(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;
