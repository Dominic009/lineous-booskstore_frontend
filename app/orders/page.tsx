"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { useOrders } from "../../hooks/use-orders";

const ORDERS_PER_PAGE = 10;

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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
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
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="font-display text-3xl lg:text-4xl font-bold">
                My Orders
              </h1>
            </div>
          </motion.div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: ORDERS_PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl p-6 shadow-warm animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-muted rounded w-32" />
                    <div className="h-6 bg-muted rounded w-24" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">
                No orders yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t placed any orders.
              </p>
              <Button onClick={() => router.push("/")}>Start Shopping</Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  className="bg-card rounded-xl p-6 shadow-warm"
                  layout
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getPaymentColor(order.paymentStatus)}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.bookTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${item.subtotal}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.bookPrice} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Payment:{" "}
                        {order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Shipping: ${order.shipping.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Discount: ${order.discount.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        Total: ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
