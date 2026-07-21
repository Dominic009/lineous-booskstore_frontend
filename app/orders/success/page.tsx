"use client";

import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Home,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";
import {
  useOrder,
  useReceiptPreview,
  useDownloadReceipt,
} from "../../../hooks/use-orders";

// Helper to parse price values (string or number)
const parsePrice = (value: string | number): number => {
  return typeof value === "string" ? parseFloat(value) : value;
};

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { data: order } = useOrder(orderId || "");
  const {
    data: receiptUrl,
    isLoading: receiptLoading,
    error: receiptError,
  } = useReceiptPreview(orderId);
  const { mutate: downloadReceipt, isPending: isDownloading } =
    useDownloadReceipt();

  useEffect(() => {
    return () => {
      if (receiptUrl) window.URL.revokeObjectURL(receiptUrl);
    };
  }, [receiptUrl]);

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">
              Order Placed Successfully!
            </h1>
            <p className="text-slate-500 mt-2">
              {order?.status === "PENDING"
                ? "Your order is pending confirmation. A receipt will be generated once the admin confirms your order."
                : "Thank you for your purchase. Your receipt is ready below."}
            </p>
          </motion.div>

          {/* Order summary */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm text-slate-500">Order Number</p>
                <p className="font-semibold text-slate-900">
                  #{order.orderNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-semibold text-violet-700 text-lg">
                  ৳{parsePrice(order.total).toFixed(2)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Receipt Preview - only for confirmed orders */}
          {order?.status !== "PENDING" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6"
            >
              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-600" />
                  Receipt Preview
                </h2>

                {receiptLoading && (
                  <div className="w-full h-[500px] bg-slate-100 rounded-lg animate-pulse" />
                )}

                {receiptError && !receiptLoading && (
                  <div className="w-full h-[200px] flex flex-col items-center justify-center text-center bg-slate-50 rounded-lg">
                    <p className="text-slate-500 mb-1">
                      {(receiptError as Error).message}
                    </p>
                    <p className="text-sm text-slate-400">
                      You can still download the receipt using the button below.
                    </p>
                  </div>
                )}

                {receiptUrl && !receiptLoading && (
                  <iframe
                    src={receiptUrl}
                    title="Receipt Preview"
                    className="w-full h-[500px] rounded-lg border border-slate-200 bg-white"
                  />
                )}
              </div>
            </motion.div>
          )}

          {order?.status === "PENDING" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden mb-6"
            >
              <div className="p-6 text-center">
                <p className="text-amber-800 font-medium">
                  Your order is awaiting confirmation. The receipt will be available once an admin confirms your order.
                </p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={() =>
                orderId &&
                downloadReceipt({ orderId, orderNumber: order?.orderNumber })
              }
              disabled={isDownloading || !orderId || order?.status === "PENDING"}
              className="flex-1 active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {order?.status === "PENDING"
                ? "Receipt Not Available"
                : isDownloading
                  ? "Preparing..."
                  : "Download Receipt"}
            </Button>
            <Link href="/orders" className="flex-1">
              <Button
                variant="outline"
                className="w-full active:scale-95 transition-transform bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                My Orders
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full active:scale-95 transition-transform bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-400">
          Loading...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
