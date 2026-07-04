"use client"
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  delay?: number;
}

const BookCard = ({
  book,
  delay = 0,
}: BookCardProps) => {
  const { addToCart } = useCartContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the default paper or first available paper
    const defaultPaper = book.papers?.find(p => p.isDefault && p.isInStock) || book.papers?.[0];
    if (defaultPaper) {
      addToCart(book.id, defaultPaper.id, 1);
    }
  };

  // Use priceRange.display for price display
  const priceDisplay = book.priceRange?.display || "Price not available";
  const hasMultiplePapers = book.papers && book.papers.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-xl overflow-hidden shadow-warm hover:shadow-warm-hover transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <motion.img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="p-3 bg-card rounded-full text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-3 bg-primary rounded-full text-primary-foreground shadow-lg hover:bg-terracotta-dark transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasMultiplePapers && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full"
            >
              {book.papers.length} variants
            </motion.span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Rating - using average of reviews if available */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-1 sm:mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length) ? "fill-gold text-gold" : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs sm:text-sm text-muted-foreground ml-1">
              ({book.reviews.length})
            </span>
          </div>
        )}

        {/* Title & Author */}
        <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
          {book.publication?.name || "Unknown Author"}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-base sm:text-xl font-bold text-primary">{priceDisplay}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm text-primary hover:text-primary hover:bg-primary/10"
            onClick={handleAddToCart}
          >
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
