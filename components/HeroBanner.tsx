"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bookstore.jpg";

// ─── Floating Book Card Component ────────────────────────
const FloatingBook = ({
  src,
  className,
  delay = 0,
  rotate = 0,
  yOffset = 0,
}: {
  src: string;
  className?: string;
  delay?: number;
  rotate?: number;
  yOffset?: number;
}) => (
  <motion.div
    className={`absolute rounded-2xl overflow-hidden shadow-2xl ${className}`}
    initial={{ opacity: 0, y: 60, rotate: rotate - 8 }}
    animate={{
      opacity: 1,
      y: [0, yOffset, 0],
      rotate: [rotate - 2, rotate + 2, rotate - 2],
    }}
    transition={{
      opacity: { delay, duration: 0.8 },
      y: { delay, duration: 5, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay, duration: 6, repeat: Infinity, ease: "easeInOut" },
    }}
  >
    <img src={src} alt="Book cover" className="w-full h-full object-cover" />
  </motion.div>
);

// ─── Main Hero Banner ────────────────────────────────────
export default function HeroBanner() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Background Layer ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${heroImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      </motion.div>

      {/* ── Decorative Blobs ── */}
      <motion.div
        className="absolute top-20 right-[15%] w-125 h-125 rounded-full bg-primary/20 blur-[100px] z-0"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-[10%] w-100 h-[400px] rounded-full bg-accent/20 blur-[80px] z-0"
        animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Content ── */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* ── Left Column: Text ── */}
          <motion.div style={{ opacity }} className="max-w-xl">
            {/* Badge */}
            {/* <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-primary/30 text-charcoal px-5 py-2.5 rounded-full mb-8 shadow-lg"
            >
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">
                New Collection Available
              </span>
            </motion.div> */}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              Discover Your Next{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-orange-500 italic font-serif">
                  Literary
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <motion.path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="var(--color-accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  />
                </motion.svg>
              </span>{" "}
              Adventure
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-lg"
            >
              Explore our curated collection of bestsellers, hidden gems, and
              timeless classics. Every book tells a story worth experiencing.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl bg-charcoal hover:bg-charcoal/80 text-white text-base font-semibold shadow-xl shadow-charcoal/20 hover:shadow-2xl transition-all duration-300 group"
              >
                Browse Collection
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Floating Books Visual ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative hidden lg:block h-[600px]"
          >
            {/* Main featured book */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl shadow-charcoal/30 z-20"
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: [-3, 3, -3],
                opacity: 1,
                y: [0, -20, 0],
              }}
              transition={{
                scale: { delay: 0.6, duration: 0.8 },
                rotate: {
                  delay: 0.8,
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                y: {
                  delay: 0.8,
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: { delay: 0.6, duration: 0.8 },
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop"
                alt="Featured book"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-1 text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <BookOpen key={i} className="w-3 h-3" />
                  ))}
                </div>
                <p className="text-white text-sm font-semibold">
                  The Great Gatsby
                </p>
                <p className="text-white/60 text-xs">F. Scott Fitzgerald</p>
              </div>
            </motion.div>

            {/* Floating smaller books */}
            <FloatingBook
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop"
              className="w-36 h-48 top-8 right-8 z-10"
              delay={0.3}
              rotate={8}
              yOffset={-15}
            />
            <FloatingBook
              src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=280&fit=crop"
              className="w-32 h-44 bottom-16 left-0 z-10"
              delay={0.5}
              rotate={-6}
              yOffset={15}
            />
            <FloatingBook
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=180&h=250&fit=crop"
              className="w-28 h-40 top-24 left-4 z-0 opacity-60"
              delay={0.7}
              rotate={-12}
              yOffset={-10}
            />

            {/* Decorative rings */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-primary/20 z-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border-2 border-dashed border-primary/15 z-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />

            {/* Small decorative elements */}
            <motion.div
              className="absolute top-12 left-1/3 w-3 h-3 rounded-full bg-primary z-30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-24 right-1/4 w-2 h-2 rounded-full bg-accent z-30"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
