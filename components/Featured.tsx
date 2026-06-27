"use client"
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import BookCard from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import Link from "next/link";

const Featured = () => {
  const { data: books = [], isLoading } = useBooks();
  
  // Show first 4 books as featured
  const featuredBooks = books.slice(0, 4);

  if (isLoading) {
    return (
      <section id="featured" className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-16 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-secondary to-forest-light p-8 lg:p-12"
        >
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Editors Pick</span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl font-bold text-secondary-foreground mb-4">
              Curated Collections for Every Mood
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Handpicked by our literary experts – books that inspire, challenge, and transform.
            </p>
            <Button variant="gold" size="lg" className="group">
              Explore Collections
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Decorative elements */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -top-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-10 bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden lg:block"
          />
        </motion.div>

        <SectionHeader
          title="Featured Books"
          subtitle="Must-read titles handpicked by our experts"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredBooks.map((book, index) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <BookCard
                book={book}
                delay={index * 0.1}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
