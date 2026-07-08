"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ChevronRight,
  Eye,
  ShoppingBag,
  Truck,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { useOrders } from "../../hooks/use-orders";

const ORDERS_PER_PAGE = 10;

// Helper to parse price values (string or number)
const parsePrice = (value: string | number): number => {
  return typeof value === 'string' ? parseFloat(value) : value;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
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
    default:
      return "bg-muted text-muted-foreground";
  }
};

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: orders = [], isLoading } = useOrders();

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

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10 h-screen">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 rounded-xl">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">
                  My Orders
                </h1>
                <p className="text-slate-500 mt-1">
                  Track and manage your orders
                </p>
              </div>
            </div>
          </motion.div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-7 bg-slate-200 rounded w-40 animate-pulse" />
                        <div className="flex gap-2">
                          <div className="h-6 bg-slate-200 rounded w-20 animate-pulse" />
                          <div className="h-6 bg-slate-200 rounded w-16 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-5 bg-slate-100 rounded w-full animate-pulse" />
                        <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse" />
                        <div className="h-5 bg-slate-100 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-3 text-slate-900">
                No orders yet
              </h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Looks like you havent placed any orders. Start shopping to see your orders here.
              </p>
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="active:scale-95 transition-transform bg-gradient-to-r from-primary via-accent to-primary hover:from-primary-hover hover:via-accent-hover hover:to-primary-hover text-white border border-primary/20 shadow-lg shadow-primary/20"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-primary/5 via-white to-white p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-bold text-slate-900">
                            Order #{order.orderNumber}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {order.orderItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{item.bookTitle}</p>
                              {item.paperName && (
                                <p className="text-sm text-primary font-medium mt-1">
                                  {item.paperName}
                                </p>
                              )}
                              <p className="text-sm text-slate-500 mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary text-lg">
                                ৳{parsePrice(item.subtotal).toFixed(2)}
                              </p>
                              <p className="text-sm text-slate-500">
                                ৳{parsePrice(item.paperPrice).toFixed(2)} each
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="h-px bg-slate-200 my-6" />

                      {/* Order Summary */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">Payment Method:</span>
                            <span className="font-medium text-slate-900">
                              {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                            </span>
                          </div>
                          {/* {order.trackingNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Truck className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-500">Tracking:</span>
                              <span className="font-medium text-slate-900">{order.trackingNumber}</span>
                            </div>
                          )} */}
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="flex justify-end items-center gap-2 text-sm">
                            <span className="text-slate-500">Subtotal:</span>
                            <span className="font-medium text-slate-900">৳{parsePrice(order.subtotal).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-end items-center gap-2 text-sm">
                            <Truck className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">Shipping:</span>
                            <span className="font-medium text-slate-900">৳{parsePrice(order.shipping).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-end items-center gap-2 text-sm">
                            <span className="text-slate-500">Discount:</span>
                            <span className="font-medium text-green-600">-৳{parsePrice(order.discount).toFixed(2)}</span>
                          </div>
                          <div className="h-px bg-slate-200 my-2" />
                          <div className="flex justify-end items-center gap-2">
                            <span className="text-lg font-bold text-slate-900">
                              Total: ৳{parsePrice(order.total).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
