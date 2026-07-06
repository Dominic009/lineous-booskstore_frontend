/* eslint-disable react-hooks/static-components */
"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShoppingCart, Heart, Star, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DealOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const book = {
    title: "The Art of Happiness",
    author: "Dalai Lama & Howard Cutler",
    description:
      "A profound exploration of happiness through Eastern wisdom and Western psychology. This timeless masterpiece offers practical guidance on finding inner peace and lasting joy in everyday life.",
    price: 9.99,
    originalPrice: 24.99,
    rating: 5,
    reviews: 1247,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop",
  };

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={value}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-gradient-to-br from-charcoal to-charcoal/80 text-primary-foreground w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-sm text-muted-foreground mt-2 font-medium">{label}</span>
    </motion.div>
  );

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/15 to-primary/10 text-primary px-6 py-3 rounded-full mb-6 backdrop-blur-sm">
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-base">Limited Time Offer</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Deal of the Day
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exclusive discounts on handpicked books – grab them before they're gone!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Book Image */}
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <div className="relative">
              <motion.div
                className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
              </motion.div>
              {/* Discount Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-primary to-terracotta-dark rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
              >
                <Zap className="w-6 h-6 mb-1" />
                <span className="text-2xl font-bold">60%</span>
                <span className="text-xs font-semibold">OFF</span>
              </motion.div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/30 blur-3xl rounded-full" />
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Timer */}
            <div className="flex items-center gap-4 mb-10">
              <Clock className="w-6 h-6 text-primary" />
              <span className="text-muted-foreground font-semibold text-lg">Ends in:</span>
              <div className="flex gap-4">
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <span className="text-4xl font-bold text-foreground self-start mt-4">:</span>
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <span className="text-4xl font-bold text-foreground self-start mt-4">:</span>
                <TimeBlock value={timeLeft.seconds} label="Secs" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
              <span className="text-muted-foreground ml-2 font-medium">
                ({book.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Title & Author */}
            <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              {book.title}
            </h3>
            <p className="text-xl text-muted-foreground mb-6">by {book.author}</p>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              {book.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-6 mb-10">
              <span className="text-5xl font-bold bg-gradient-to-r from-primary to-terracotta-dark bg-clip-text text-transparent">
                ${book.price}
              </span>
              <span className="text-2xl text-muted-foreground line-through">
                ${book.originalPrice}
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary text-base font-bold rounded-full">
                Save ${(book.originalPrice - book.price)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" className="flex-1 h-14 rounded-2xl font-semibold group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-2xl font-semibold">
                <Heart className="w-5 h-5" />
                Wishlist
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}