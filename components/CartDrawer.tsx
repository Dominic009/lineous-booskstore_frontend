"use client"
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/contexts/CartContext";
import Link from "next/link";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice, isLoading } = useCartContext();

  if (isLoading) {
    return (
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-display text-2xl">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Loading...
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display text-2xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4"
            >
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </motion.div>
            <h3 className="font-display text-xl font-semibold mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Looks like you havent added any books yet.
            </p>
            <Button onClick={() => setIsCartOpen(false)} asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-muted/30 rounded-lg p-3"
                  >
                    <Link 
                      href={`/book/${item.book.id}`} 
                      onClick={() => setIsCartOpen(false)}
                      className="shrink-0"
                    >
                      <img
                        src={item.book.thumbnail}
                        alt={item.book.title}
                        className="w-20 h-28 object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/book/${item.book.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-medium line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.book.publication?.name || "Unknown Author"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-muted transition-colors active:scale-95"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-muted transition-colors active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-primary">
                          ${((item.book.discountPrice || item.book.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors active:scale-95"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Shipping and taxes calculated at checkout
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full active:scale-95 transition-transform"
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
                  className="w-full active:scale-95 transition-transform"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
