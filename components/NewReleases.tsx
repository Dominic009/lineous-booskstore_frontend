"use client"

import { useBooks } from "@/hooks/use-books";
import BookCard from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";

const NewReleases = () => {
  const { data: books = [], isLoading } = useBooks();
  
  // Filter books that have discount (treating them as "new" or "featured")
  const newBooks = books.slice(0, 4);

  if (isLoading) {
    return (
      <section id="new-releases" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="New Releases"
            subtitle="Fresh off the press – discover the latest additions to our collection"
          />
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
    <section id="new-releases" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="New Releases"
          subtitle="Fresh off the press – discover the latest additions to our collection"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newBooks.map((book, index) => (
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

export default NewReleases;
