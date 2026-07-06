"use client";
import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";
import BookCard from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";
import { useBooks } from "@/hooks/use-books";
import Link from "next/link";

export default function PopularBooks() {
  const { data: books = [], isLoading } = useBooks();
  
  const popularBooks = books.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-2xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-3"
        >
          <Flame className="w-6 h-6 text-primary" />
          <span className="text-primary font-bold text-lg">Trending Now</span>
        </motion.div>

        <SectionHeader
          title="Popular Books"
          subtitle="What readers are loving right now"
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularBooks.map((book, index) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <BookCard
                book={book}
                delay={index * 0.08}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}