"use client";

import type { Book } from "../types/book";

interface OverviewPageProps {
  books: Book[];
  authorCount: number;
  librarianCount: number;
}

export function OverviewPage({
  books,
  authorCount,
  librarianCount,
}: OverviewPageProps) {
  const totalBooks = books.length;

  const borrowedBooks = books.filter(
    (book) => book.status === "OUT"
  ).length;

  const availableBooks = books.filter(
    (book) => book.status === "IN"
  ).length;

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl text-black font-bold mb-6">
        Overview
      </h1>

      <div className="flex flex-wrap gap-8">

        {/* TOTAL BOOKS */}
        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <div className="text-3xl mb-3">
            {totalBooks}
          </div>

          <p className="text-xl font-bold">
            Total Books
          </p>
        </div>

        {/* AVAILABLE BOOKS */}
        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <div className="text-3xl mb-3">
            {availableBooks}
          </div>

          <p className="text-xl font-bold">
            Available Books
          </p>
        </div>

        {/* BORROWED BOOKS */}
        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <div className="text-3xl mb-3">
            {borrowedBooks}
          </div>

          <p className="text-xl font-bold">
            Borrowed Books
          </p>
        </div>

        {/* AUTHORS */}
        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <h2 className="text-3xl font-bold mt-2">
            {authorCount}
          </h2>

          <p className="text-xl font-bold mb-3">
            Total Authors
          </p>
        </div>

        {/* LIBRARIANS */}
        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <h2 className="text-3xl font-bold mt-2">
            {librarianCount}
          </h2>

          <p className="text-xl font-bold mb-3">
            Library Attendants
          </p>
        </div>

      </div>
    </div>
  );
}