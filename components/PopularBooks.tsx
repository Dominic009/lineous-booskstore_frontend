"use client"
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import BookCard from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";
import { useBooks } from "@/hooks/use-books";
import Link from "next/link";

const PopularBooks = () => {
  const { data: books = [], isLoading } = useBooks();
  
  const popularBooks = books.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-2"
        >
          <TrendingUp className="w-6 h-6 text-primary" />
          <span className="text-primary font-semibold">Trending Now</span>
        </motion.div>

        <SectionHeader
          title="Popular Books"
          subtitle="What readers are loving right now"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
};

export default PopularBooks;
