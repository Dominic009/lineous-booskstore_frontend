"use client"

import { useBooks } from "@/hooks/use-books";
import BookCard from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { PackageCheck } from "lucide-react";

export default function NewReleases() {
  const { data: books = [], isLoading } = useBooks();
  
  const newBooks = books.slice(0, 4);

  if (isLoading) {
    return (
      <section id="new-releases" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="New Releases"
            subtitle="Fresh off the press – discover the latest additions to our collection"
            icon={<PackageCheck className="w-6 h-6 text-primary" />}
          />
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
    <section id="new-releases" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="New Releases"
          subtitle="Fresh off the press – discover the latest additions to our collection"
          icon={<PackageCheck className="w-6 h-6 text-primary" />}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {newBooks.map((book, index) => (
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
