"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Eye,
  ShoppingBag,
  Truck,
  CreditCard,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";
import { useAuth } from "../../contexts/AuthContext";
import { useOrderContext } from "../../contexts/OrderContext";
import { useOrders } from "../../hooks/use-orders";
import { Order } from "@/lib/types";
import {
  OrderFilters,
  DEFAULT_ORDER_FILTERS,
  OrderFilterState,
} from "../../components/OrderFilters";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isToday = (dateString: string) => {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const withinDays = (dateString: string, days: number) => {
  const diff = Date.now() - new Date(dateString).getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
};

function OrderAccordionItem({
  order,
  downloadReceipt,
  isDownloading,
}: {
  order: Order;
  downloadReceipt: (orderId: string, orderNumber?: string) => void;
  isDownloading: boolean;
}) {
  return (
    <AccordionItem
      value={order.id}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 hover:border-violet-200 transition-colors"
    >
      <AccordionTrigger className="p-0 hover:no-underline">
        <div className="w-full bg-gradient-to-r from-violet-50 via-white to-white p-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
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
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-6">
          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.bookTitle}</p>
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

          <div className="h-px bg-slate-200 my-6" />

          {/* Order Summary */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-medium text-slate-900">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex justify-end items-center gap-2 text-sm">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-medium text-slate-900">
                  ৳{parsePrice(order.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Shipping:</span>
                <span className="font-medium text-slate-900">
                  ৳{parsePrice(order.shipping).toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-end items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  Total: ৳{parsePrice(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 my-6" />

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
            <button
              type="button"
              onClick={() => downloadReceipt(order.id, order.orderNumber)}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Preparing..." : "Download Receipt"}
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: orders = [], isLoading } = useOrders();
  const { downloadReceipt, isDownloading } = useOrderContext();
  const [filters, setFilters] = useState<OrderFilterState>(
    DEFAULT_ORDER_FILTERS
  );

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Frontend filtering
  const filtered = orders.filter((order) => {
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const match = order.orderItems.some((it) =>
        it.bookTitle.toLowerCase().includes(q)
      );
      if (!match) return false;
    }
    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(order.status)
    ) {
      return false;
    }
    if (filters.dateRange === "today" && !isToday(order.createdAt)) return false;
    if (filters.dateRange === "week" && !withinDays(order.createdAt, 7))
      return false;
    if (filters.dateRange === "month" && !withinDays(order.createdAt, 30))
      return false;
    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const recentOrders = sorted.filter((o) => isToday(o.createdAt));
  const previousOrders = sorted.filter((o) => !isToday(o.createdAt));

  const recentDefault = recentOrders[0]?.id ? [recentOrders[0].id] : [];
  const previousDefault =
    recentOrders.length === 0 && previousOrders[0]
      ? [previousOrders[0].id]
      : [];

  return (
    <div className="relative bg-white">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
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

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: sticky filters */}
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24">
                <OrderFilters
                  value={filters}
                  onChange={setFilters}
                  resultCount={sorted.length}
                />
              </div>
            </aside>

            {/* Right: scrollable orders list */}
            <div className="flex-1 min-w-0 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                    >
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sorted.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <h2 className="font-display text-3xl font-bold mb-3 text-slate-900">
                    No orders found
                  </h2>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {orders.length === 0
                      ? "Looks like you haven't placed any orders. Start shopping to see your orders here."
                      : "No orders match your current filters."}
                  </p>
                  {orders.length === 0 ? (
                    <Button
                      onClick={() => router.push("/")}
                      size="lg"
                      className="active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Start Shopping
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setFilters(DEFAULT_ORDER_FILTERS)}
                      size="lg"
                      className="active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100"
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                <>
                  {recentOrders.length > 0 && (
                    <section className="mb-8">
                      <h2 className="font-display text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-600" />
                        Recent
                      </h2>
                      <Accordion type="multiple" defaultValue={recentDefault}>
                        {recentOrders.map((order) => (
                          <OrderAccordionItem
                            key={order.id}
                            order={order}
                            downloadReceipt={downloadReceipt}
                            isDownloading={isDownloading}
                          />
                        ))}
                      </Accordion>
                    </section>
                  )}

                  {previousOrders.length > 0 && (
                    <section>
                      <h2 className="font-display text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        Previous
                      </h2>
                      <Accordion type="multiple" defaultValue={previousDefault}>
                        {previousOrders.map((order) => (
                          <OrderAccordionItem
                            key={order.id}
                            order={order}
                            downloadReceipt={downloadReceipt}
                            isDownloading={isDownloading}
                          />
                        ))}
                      </Accordion>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
