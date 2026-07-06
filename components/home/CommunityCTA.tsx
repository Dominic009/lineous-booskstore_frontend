"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";

const CommunityCTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Join the club */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-terracotta-dark p-10 lg:p-12 text-primary-foreground"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl"
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 mb-5 backdrop-blur-sm">
                <Star className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  Join the Club
                </span>
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Become part of a community that lives for the next chapter
              </h3>
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-md">
                Create a free account to save favorites, track orders, and get
                personalized picks from our editors — no spam, just stories.
              </p>
              <Link href="/login">
                <motion.button
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white text-primary px-7 h-14 text-base font-semibold shadow-lg"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-border bg-card p-10 lg:p-12 flex flex-col justify-center shadow-sm"
          >
            <Quote className="w-10 h-10 text-gold/60 mb-6" />
            <p className="font-display text-2xl lg:text-3xl font-medium text-foreground leading-snug">
              &ldquo;Chroma Bookshelf feels less like a store and more like a
              friend who always knows the perfect book to hand you.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-terracotta flex items-center justify-center text-white font-display font-bold text-lg">
                A
              </div>
              <div>
                <p className="font-semibold text-foreground">Ayesha Rahman</p>
                <p className="text-sm text-muted-foreground">
                  Member since 2021
                </p>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold text-gold"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunityCTA;
