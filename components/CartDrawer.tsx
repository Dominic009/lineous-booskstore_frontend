"use client"
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { BookPaper } from "@/lib/types";
import Link from "next/link";

// Helper to calculate effective price from paper
function getEffectivePrice(paper: BookPaper | null): number {
  if (!paper) return 0;
  
  // If effectivePrice is provided, use it
  if (paper.effectivePrice !== undefined) {
    return paper.effectivePrice;
  }
  
  // Calculate from price and discount
  const price = typeof paper.price === 'string' ? parseFloat(paper.price) : paper.price;
  const discountPrice = paper.discountPrice 
    ? (typeof paper.discountPrice === 'string' ? parseFloat(paper.discountPrice) : paper.discountPrice)
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

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice, isLoading } = useCartContext();

  if (isLoading) {
    return (
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-full sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl"
            >
              <div className="p-6 w-full h-full overflow-y-auto">
                <div className="flex items-center gap-2 font-display text-2xl text-slate-900">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  Loading...
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-999"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 w-full sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl"
          >
            <div className="flex flex-col h-full p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between mb-6"
              >
                <h2 className="flex items-center gap-2 font-display text-2xl text-slate-900">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  Your Cart ({totalItems})
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>

              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <ShoppingBag className="w-12 h-12 text-slate-400" />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-slate-900">
                    Your cart is empty
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Looks like you havent added any books yet.
                  </p>
                   <Button onClick={() => setIsCartOpen(false)} asChild className="bg-primary hover:bg-primary-hover text-white">
                     <Link href="/">Start Shopping</Link>
                   </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex-1 overflow-y-auto py-4 space-y-4"
                  >
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="flex gap-4 bg-white rounded-xl p-3 border border-slate-200 shadow-sm"
                        >
                          <Link 
                            href={`/book/${item.book.id}`} 
                            onClick={() => setIsCartOpen(false)}
                            className="shrink-0"
                          >
                            <img
                              src={item.paper?.thumbnail || item.book.thumbnail}
                              alt={item.book.title}
                              className="w-20 h-28 object-cover rounded-lg border border-slate-200 hover:opacity-80 transition-opacity"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/book/${item.book.id}`}
                              onClick={() => setIsCartOpen(false)}
                              className="font-medium line-clamp-2 text-slate-900 hover:text-primary transition-colors"
                            >
                              {item.book.title}
                            </Link>
                            {item.paper && (
                              <p className="text-sm text-primary font-medium mb-1">
                                {item.paper.name}
                              </p>
                            )}
                            <p className="text-sm text-slate-500 mb-2">
                              {item.paper ? `${item.paper.name} • ` : ""}Book
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1.5 hover:bg-slate-50 transition-colors active:scale-95 text-slate-600"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-sm font-medium text-slate-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1.5 hover:bg-slate-50 transition-colors active:scale-95 text-slate-600"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-semibold text-primary">
                                ৳{getEffectivePrice(item.paper) * item.quantity}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="shrink-0 p-1 text-slate-400 hover:text-red-600 transition-colors active:scale-95"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="pt-4 border-t border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-2xl font-bold text-slate-900">
                        ৳{totalPrice}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      Shipping and taxes calculated at checkout
                    </p>
                    <div className="space-y-3">
                      <Button
                        className="w-full active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                        size="lg"
                        asChild
                        onClick={() => setIsCartOpen(false)}
                      >
                        <Link href="/checkout">
                          Checkout
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full active:scale-95 transition-transform bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
