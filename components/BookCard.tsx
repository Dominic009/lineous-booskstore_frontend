
"use client"
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, Book } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface BookCardProps {
  id?: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isBestseller?: boolean;
  delay?: number;
}

const BookCard = ({
  id,
  title,
  author,
  price,
  originalPrice,
  image,
  rating,
  isNew,
  isBestseller,
  delay = 0,
}: BookCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const book: Book = {
      id: id || crypto.randomUUID(),
      title,
      author,
      price,
      originalPrice,
      image,
      rating,
      isNew,
      isBestseller,
    };
    
    addToCart(book);
    toast({
      title: "Added to cart",
      description: `"${title}" has been added to your cart.`,
    });
  };

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
          src={image}
          alt={title}
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
          {isNew && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full"
            >
              New
            </motion.span>
          )}
          {isBestseller && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-gold text-charcoal text-xs font-semibold rounded-full"
            >
              Bestseller
            </motion.span>
          )}
          {originalPrice && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full"
            >
              -{Math.round((1 - price / originalPrice) * 100)}%
            </motion.span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                i < rating ? "fill-gold text-gold" : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs sm:text-sm text-muted-foreground ml-1">({rating}.0)</span>
        </div>

        {/* Title & Author */}
        <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{author}</p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-base sm:text-xl font-bold text-primary">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
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
