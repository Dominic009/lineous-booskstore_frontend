"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

    const defaultPaper = book.papers?.find(p => p.isDefault && p.isInStock) || book.papers?.[0];
    if (defaultPaper) {
      addToCart(book.id, defaultPaper.id, 1);
    }
  };

  const priceDisplay = book.priceRange?.display || "Price not available";
  const hasMultiplePapers = book.papers && book.papers.length > 1;

  const avgRating = book.reviews && book.reviews.length > 0
    ? Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg shadow-slate-200/80 transition-all duration-500 hover:shadow-xl hover:shadow-violet-100/80 hover:border-violet-200"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {hasMultiplePapers && (
            <Badge className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium shadow-sm">
              {book.papers.length} variants
            </Badge>
          )}
        </div>

        {/* Subject Badge */}
        {book.subject && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-[10px] font-medium bg-white border border-slate-200 text-slate-700 shadow-sm">
              {book.subject.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2 leading-tight group-hover:text-violet-700 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-slate-500 mb-2 truncate">
          {book.publication?.name || "Unknown Author"}
        </p>

        {/* Rating */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < avgRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400">({book.reviews.length})</span>
          </div>
        )}

        {/* Price and Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-violet-700">{priceDisplay}</span>
          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 transition-all duration-300 active:scale-95"
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
