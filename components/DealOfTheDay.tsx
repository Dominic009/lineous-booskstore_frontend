/* eslint-disable react-hooks/static-components */
"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShoppingCart, Heart, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const DealOfTheDay = () => {
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
      <div className="bg-charcoal text-primary-foreground w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-sm text-muted-foreground mt-2">{label}</span>
    </motion.div>
  );

  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Flame className="w-4 h-4 animate-pulse" />
            <span className="font-semibold">Limited Time Offer</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Deal of the Day
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Book Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative">
              <motion.img
                src={book.image}
                alt={book.title}
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* Discount Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-primary rounded-full flex flex-col items-center justify-center text-primary-foreground shadow-lg"
              >
                <span className="text-2xl font-bold">60%</span>
                <span className="text-sm">OFF</span>
              </motion.div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-primary/20 blur-3xl rounded-full" />
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Timer */}
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground font-medium">Ends in:</span>
              <div className="flex gap-3">
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <span className="text-3xl font-bold text-foreground self-start mt-4">:</span>
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <span className="text-3xl font-bold text-foreground self-start mt-4">:</span>
                <TimeBlock value={timeLeft.seconds} label="Secs" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
              <span className="text-muted-foreground ml-2">
                ({book.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Title & Author */}
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {book.title}
            </h3>
            <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {book.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-primary">
                ${book.price.toFixed(2)}
              </span>
              <span className="text-xl text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                Save ${(book.originalPrice - book.price).toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="xl" className="flex-1 group">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="xl">
                <Heart className="w-5 h-5" />
                Wishlist
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
