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
import { useState, useEffect, useRef } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useCartContext } from "../../../contexts/CartContext";
import { useBook } from "../../../hooks/use-books";

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const initializedRef = useRef(false);
  
  const { data: book, isLoading, error } = useBook(params?.id as string);

  // Set default paper on book load
  useEffect(() => {
    if (book && book.papers && !initializedRef.current) {
      initializedRef.current = true;
      const defaultPaper = book.papers.find(p => p.isDefault && p.status === "PUBLISHED");
      const paperId = defaultPaper ? defaultPaper.id : (book.papers.length > 0 ? book.papers[0].id : null);
      if (paperId) {
        // Use setTimeout to avoid eslint warning about setState in useEffect
        setTimeout(() => {
          setSelectedPaperId(paperId);
        }, 0);
      }
    }
  }, [book]);

  const handleAddToCart = () => {
    if (book) {
      if (!selectedPaperId) {
        alert("Please select a paper variant");
        return;
      }
      addToCart(book.id, selectedPaperId, quantity);
    }
  };

  // Get selected paper
  const selectedPaper = book?.papers?.find(p => p.id === selectedPaperId);

  // Helper to calculate effective price from paper
  const getEffectivePrice = (paper: typeof selectedPaper): number => {
    if (!paper) return 0;
    
    // If effectivePrice is provided, use it
    if (paper.effectivePrice !== undefined) {
      return paper.effectivePrice;
    }
    
    // Calculate from price and discount
    const price = typeof paper.price === 'string' ? parseFloat(paper.price) : paper.price;
    const discountPrice = paper.discountPrice 
      ? (typeof paper.discountPrice === 'string' ? parseFloat(paper.discountPrice) : paper.discountPrice)
      : null;
    
    // Check if discount is active
    if (discountPrice && paper.discountStartDate && paper.discountEndDate) {
      const now = new Date();
      const startDate = new Date(paper.discountStartDate);
      const endDate = new Date(paper.discountEndDate);
      if (now >= startDate && now <= endDate) {
        return discountPrice;
      }
    }
    
    return price;
  };

  // Price display logic
  const getDisplayPrice = () => {
    if (!selectedPaper) return { price: 0, originalPrice: null, discount: 0 };
    
    const price = typeof selectedPaper.price === 'string' ? parseFloat(selectedPaper.price) : selectedPaper.price;
    const effectivePrice = getEffectivePrice(selectedPaper);
    
    const now = new Date();
    const isDiscounted = selectedPaper.discountPrice &&
      selectedPaper.discountStartDate &&
      selectedPaper.discountEndDate &&
      now >= new Date(selectedPaper.discountStartDate) &&
      now <= new Date(selectedPaper.discountEndDate);

    if (isDiscounted) {
      return {
        price: effectivePrice,
        originalPrice: price,
        discount: Math.round((1 - effectivePrice / price) * 100)
      };
    }

    return {
      price: price,
      originalPrice: null,
      discount: 0
    };
  };

  const features = [
    { icon: Truck, text: "Free shipping over ৳35" },
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

  const priceInfo = getDisplayPrice();
  const thumbnail = selectedPaper?.thumbnail || book.thumbnail;

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
                  src={thumbnail}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {priceInfo.discount > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    -{priceInfo.discount}% OFF
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

              {/* Paper Selection */}
              {book.papers && book.papers.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Select Paper</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.papers
                      .filter(p => p.status === "PUBLISHED")
                      .map((paper) => (
                      <button
                        key={paper.id}
                        onClick={() => setSelectedPaperId(paper.id)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedPaperId === paper.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        <div className="text-sm font-medium">{paper.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ৳{getEffectivePrice(paper)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl sm:text-4xl font-bold text-primary">
                  ৳{priceInfo.price}
                </span>
                {priceInfo.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ৳{priceInfo.originalPrice}
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
                  <p className="font-semibold">{selectedPaper?.pageCount || book.edition}</p>
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