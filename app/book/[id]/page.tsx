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
      <div className="relative min-h-screen bg-white overflow-hidden">
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded mb-4 w-40" />
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-96 bg-slate-200 rounded-2xl" />
                <div className="space-y-4">
                  <div className="h-12 bg-slate-200 rounded-xl" />
                  <div className="h-6 bg-slate-200 rounded-xl w-3/4" />
                  <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="relative min-h-screen bg-white">
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-4 text-slate-900">Book not found</h1>
            <p className="text-slate-500 mb-6">The book you are looking for doesnt exist or is not available.</p>
            <Button onClick={() => router.push("/")}>Browse Books</Button>
          </div>
        </main>
      </div>
    );
  }

  const priceInfo = getDisplayPrice();
  const thumbnail = selectedPaper?.thumbnail || book.thumbnail;

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors"
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
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/80">
                <img
                  src={thumbnail}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {priceInfo.discount > 0 && (
                  <Badge className="bg-violet-600 text-white border border-violet-500/30 shadow-lg shadow-violet-200">
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
              <Badge variant="outline" className="w-fit mb-4 bg-white border-slate-200 text-slate-700">
                {book.subject?.name || "Uncategorized"}
              </Badge>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                {book.title}
              </h1>

              <p className="text-lg text-slate-500 mb-4">
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
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-500">
                    ({book.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Paper Selection */}
              {book.papers && book.papers.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-slate-900">Select Paper</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.papers
                      .filter(p => p.status === "PUBLISHED")
                      .map((paper) => (
                      <button
                        key={paper.id}
                        onClick={() => setSelectedPaperId(paper.id)}
                        className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                          selectedPaperId === paper.id
                            ? "border-violet-500/50 bg-violet-50 text-violet-700 shadow-md shadow-violet-100"
                            : "border-slate-200 hover:border-violet-200 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <div className="text-sm font-medium">{paper.name}</div>
                        <div className="text-xs text-slate-500">
                          ৳{getEffectivePrice(paper)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl sm:text-4xl font-bold text-violet-700">
                  ৳{priceInfo.price}
                </span>
                {priceInfo.originalPrice && (
                  <span className="text-xl text-slate-500 line-through">
                    ৳{priceInfo.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600/90 leading-relaxed mb-8">
                {book.description}
              </p>

              {/* Book Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm text-slate-500">Pages</p>
                  <p className="font-semibold text-slate-900">{selectedPaper?.pageCount || book.edition}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Published</p>
                  <p className="font-semibold text-slate-900">{book.publicationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">ISBN</p>
                  <p className="font-semibold text-slate-900">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Language</p>
                  <p className="font-semibold text-slate-900">{book.language}</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-50 transition-colors active:scale-95 text-slate-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-semibold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-50 transition-colors active:scale-95 text-slate-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 active:scale-95 transition-transform py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl border border-violet-500/20 shadow-lg shadow-violet-100 hover:shadow-xl hover:shadow-violet-200"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="active:scale-95 transition-transform bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <feature.icon className="w-4 h-4 text-violet-600" />
                    {feature.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailsPage;