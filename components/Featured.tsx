"use client"
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import BookCard from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import Link from "next/link";

export default function Featured() {
  const { data: books = [], isLoading } = useBooks();
  
  const featuredBooks = books.slice(0, 4);

  if (isLoading) {
    return (
      <section id="featured" className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-2xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-16 bg-gradient-to-r from-secondary to-forest-light p-10 lg:p-16"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-gold/20 text-gold px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">Editors Pick</span>
            </div>
            <h3 className="font-display text-4xl lg:text-5xl font-bold text-secondary-foreground mb-5 leading-tight">
              Curated Collections for Every Mood
            </h3>
            <p className="text-secondary-foreground/90 mb-8 text-lg leading-relaxed">
              Handpicked by our literary experts – books that inspire, challenge, and transform.
            </p>
            <Button variant="gold" size="lg" className="group rounded-2xl px-8 h-14 text-base font-semibold">
              Explore Collections
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>

          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -right-24 -top-24 w-72 h-72 bg-gold/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-12 bottom-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl hidden lg:block"
          />
        </motion.div>

        <SectionHeader
          title="Featured Books"
          subtitle="Must-read titles handpicked by our experts"
          icon={<BookOpen className="w-6 h-6 text-primary" />}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredBooks.map((book, index) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <BookCard
                book={book}
                delay={index * 0.15}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
