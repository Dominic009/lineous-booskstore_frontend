"use client"
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  // Calculate average rating
  const avgRating = book.reviews && book.reviews.length > 0
    ? Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasMultiplePapers && (
            <Badge className="bg-primary text-primary-foreground text-[10px] font-medium">
              {book.papers.length} variants
            </Badge>
          )}
        </div>

        {/* Subject Badge */}
        {book.subject && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-[10px] font-medium bg-white/90 backdrop-blur-sm">
              {book.subject.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col h-[120px]">
        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        
        {/* Author */}
        <p className="text-xs text-gray-500 mb-2 truncate">
          {book.publication?.name || "Unknown Author"}
        </p>

        {/* Rating */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({book.reviews.length})</span>
          </div>
        )}

        {/* Price and Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{priceDisplay}</span>
          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded-lg bg-primary hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
