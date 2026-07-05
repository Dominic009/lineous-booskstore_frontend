"use client"
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
    
    const defaultPaper = book.papers?.find(p => p.isDefault && p.isInStock) || book.papers?.[0];
    if (defaultPaper) {
      addToCart(book.id, defaultPaper.id, 1);
    }
  };

  const priceDisplay = book.priceRange?.display || "Price not available";

  const paperVariants = book.papers?.slice(0, 2).map(p => p.name || p.code).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[420px] w-full"
      style={{
        boxShadow: "0 10px 30px rgba(111, 99, 184, 0.12)",
      }}
    >
      <div className="relative h-[220px] bg-gradient-to-br from-[#6F63A8] to-[#B5A9E5] flex items-center justify-center overflow-hidden">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        <button className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
          <Heart className="w-5 h-5 text-white/80" strokeWidth={1.5} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-charcoal mb-2 line-clamp-2 leading-tight">
          {book.title}
        </h3>

        {paperVariants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {paperVariants.map((variant, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-[8px] border border-gray-300 bg-white px-3 py-1 text-xs font-medium uppercase text-warm-gray tracking-wide"
              >
                {variant}
              </span>
            ))}
          </div>
        )}

        {book.shortDescription && (
          <p className="text-sm text-warm-gray leading-relaxed mb-3 line-clamp-2">
            {book.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">
              Price
            </span>
            <span className="block text-xl font-bold text-terracotta">
              {priceDisplay}
            </span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="h-10 px-5 rounded-[14px] bg-terracotta hover:bg-terracotta-dark text-white font-semibold text-sm shadow-md"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
