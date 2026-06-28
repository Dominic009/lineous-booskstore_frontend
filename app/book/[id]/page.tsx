"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BookCard from "../../../components/BookCard";
import { useCartContext } from "../../../contexts/CartContext";
import { useBook } from "../../../hooks/use-books";
import { Button } from "../../../components/ui/button";

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  
  const { data: book, isLoading, error } = useBook(params?.id as string);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book.id, quantity);
    }
  };

  const features = [
    { icon: Truck, text: "Free shipping over $35" },
    { icon: Shield, text: "Secure payment" },
    { icon: RotateCcw, text: "30-day returns" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4" />
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-96 bg-muted rounded-xl" />
                <div className="space-y-4">
                  <div className="h-12 bg-muted rounded" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Book not found</h1>
            <p className="text-muted-foreground mb-6">The book you are looking for doesnt exist or is not available.</p>
            <Button onClick={() => router.push("/")}>Browse Books</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayPrice = book.discountPrice || book.price;
  const hasDiscount = !!book.discountPrice;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
          </motion.div>

          {/* Book Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-warm-hover">
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge className="bg-primary text-primary-foreground">
                    -{Math.round((1 - displayPrice / book.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <Badge variant="outline" className="w-fit mb-4">
                {book.subject?.name || "Uncategorized"}
              </Badge>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-2">
                {book.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-4">
                by {book.publication?.name || "Unknown Author"}
              </p>

              {/* Rating */}
              {book.reviews && book.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length)
                            ? "fill-gold text-gold"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({book.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl sm:text-4xl font-bold text-primary">
                  ${displayPrice }
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${book.price }
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed mb-8">
                {book.description}
              </p>

              {/* Book Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-semibold">{book.edition}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="font-semibold">{book.publicationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-semibold">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-semibold">{book.language}</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 active:scale-95 transition-transform py-3"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="active:scale-95 transition-transform"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <feature.icon className="w-4 h-4 text-primary" />
                    {feature.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Books Section - Placeholder */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-8">
              You May Also Like
            </h2>
            <p className="text-muted-foreground">
              Related books will appear here once data is added.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetailsPage;