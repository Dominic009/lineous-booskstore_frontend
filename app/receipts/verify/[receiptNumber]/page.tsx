"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVerifyReceipt } from "@/hooks/use-orders";

// Helper to parse price values (string or number)
const parsePrice = (value: string | number): number => {
  return typeof value === "string" ? parseFloat(value) : value;
};

const ReceiptVerifyPage = () => {
  const params = useParams();
  const receiptNumber = params?.receiptNumber as string | undefined;
  const router = useRouter();
  const [input, setInput] = useState("");

  const { data: receipt, isLoading, error } = useVerifyReceipt(
    receiptNumber || ""
  );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (value) {
      router.push(`/receipts/verify/${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-50 rounded-xl">
                <FileText className="w-8 h-8 text-violet-600" />
              </div>
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">
                  Verify Receipt
                </h1>
                <p className="text-slate-500 mt-1">
                  Enter a receipt number to verify its authenticity
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleVerify}
            className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 flex flex-col sm:flex-row gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. RC-20260706-ABC123"
              className="flex-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
            <Button
              type="submit"
              className="active:scale-95 transition-transform bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:via-indigo-500 hover:to-violet-500 text-white border border-violet-500/20 shadow-lg shadow-violet-100"
            >
              <Search className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </motion.form>

          {/* Result */}
          {receiptNumber && isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6">
              <div className="h-6 bg-slate-200 rounded w-1/2 animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          )}

          {receiptNumber && error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-slate-200"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3 text-slate-900">
                Verification Failed
              </h2>
              <p className="text-slate-500 mb-2 max-w-md mx-auto">
                {(error as Error).message}
              </p>
            </motion.div>
          )}

          {receipt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-50 via-white to-white p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      Receipt Verified
                    </h2>
                    <p className="text-sm text-slate-500">
                      {receipt.receiptNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-6">
                {/* QR + PDF */}
                <div className="space-y-4">
                  {receipt.qrCodeUrl && (
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receipt.qrCodeUrl}
                        alt="Receipt QR Code"
                        className="w-40 h-40 object-contain rounded-lg bg-white"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Scan to verify
                      </p>
                    </div>
                  )}
                  <a
                    href={receipt.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium text-violet-700 hover:text-violet-800 transition-colors p-3 border border-violet-200 rounded-xl hover:bg-violet-50"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>

                {/* Order info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Order Number</p>
                    <p className="font-semibold text-slate-900">
                      {receipt.order.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="font-semibold text-violet-700 text-lg">
                      ৳{parsePrice(receipt.order.total).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="font-semibold text-slate-900">
                      {receipt.order.status}
                    </p>
                  </div>

                  {receipt.order.orderItems &&
                    receipt.order.orderItems.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Items</p>
                        <div className="space-y-2">
                          {receipt.order.orderItems.map((item, i) => (
                            <div
                              key={item.id || i}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm"
                            >
                              <span className="font-medium text-slate-900">
                                {item.bookTitle}
                                {item.paperName && (
                                  <span className="text-violet-700 font-normal">
                                    {" "}
                                    ({item.paperName})
                                  </span>
                                )}
                              </span>
                              <span className="text-slate-500">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          )}

          {!receiptNumber && (
            <div className="text-center py-12 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Enter a receipt number above to verify a purchase.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReceiptVerifyPage;
