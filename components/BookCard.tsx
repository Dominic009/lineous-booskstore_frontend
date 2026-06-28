"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Zap, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  delay?: number;
}

const BookCard = ({ book, delay = 0 }: BookCardProps) => {
  const { addToCart } = useCartContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(book.id, 1);
  };

  const displayPrice = book.discountPrice || book.price;
  const hasDiscount = !!book.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - displayPrice / book.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted">
        <motion.img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-xl text-charcoal shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 bg-primary rounded-xl text-primary-foreground shadow-lg hover:bg-terracotta-dark transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-xl text-charcoal shadow-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
            className="absolute top-4 left-4 bg-gradient-to-r from-primary to-terracotta-dark text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
          >
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />-{discountPercent}%
            </div>
          </motion.div>
        )}

        {/* Rating Badge */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-xs font-semibold text-charcoal">
              {Math.round(
                book.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  book.reviews.length,
              )}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Genre/Category */}
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {book.publication?.name || "Literature"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-muted-foreground mb-3">
          {book.publication?.name || "Unknown Author"}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              ${displayPrice}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.price}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10 font-semibold"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Animated border on hover */}
      <motion.div
        className="absolute inset-0 border-2 border-primary/0 rounded-2xl pointer-events-none"
        initial={{ borderColor: "hsl(var(--primary) / 0)" }}
        whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default BookCard;
