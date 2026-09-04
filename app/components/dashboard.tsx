"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import Sidebar from "./sidebar";


export type Dashboard =
  | "overview"
  | "borrow"
  | "return";

interface ReturnData {
  bookId: string;
}

interface DashboardPageProps {
  currentPage: "overview" | "borrow" | "return";
  onNavigate: (
    page: "overview" | "borrow" | "return"
  ) => void;

  books: Book[];
  userId: string;

  onReturnBook: (data: {
    bookId: string;
  }) => Promise<void>;

  selectedBook?: Book | null;

  authorCount: number;
  librarianCount: number;
}

interface BorrowBookPageProps {
  books: Book[];
  selectedBook?: Book | null;
}

interface ReturnBookPageProps {
  books: Book[];

  userId: string;

  onConfirm: (data: {
    bookId: string;
  }) => Promise<void> | void;
}

// interface Card{
//     id: number,
//     image1: ReactNode,
//     title: string,
// }

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
    // const cards: Card[] = [
    //     {
    //       id: 1,
    //       image1: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" fill='white' stroke='white' strokeWidth="2"/></svg>
    //         // <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    //         //   <path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" stroke='white' strokeWidth="2" />
    //         // </svg>
    //       ),
    //       title: "Total Books"
    //     },
    //     { id: 3, 
    //     image1: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z" fill='white' stroke='white' strokeWidth={1}/></svg>    
    //     ),    
    //     title: "Authors" },
    //     { id: 8,
    //     image1: (<svg width="20" height="20" fill="white" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75" fill='#0093cde3' stroke='#0093cde3' strokeWidth="2"/></svg>),
    //     // image1: (<img src="education.png" alt="Education" style={{ filter: "invert(1)" }} />),    
    //     title: "Students" },
    //     { id: 4, 
    //     image1: (<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z" fill='white' stroke='white' strokeWidth={1}/></svg>
    //     ),     
    //     title: "Attendants" },
    //     { id: 7, 
    //     image1: (<svg width="17" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3" strokeWidth="2"/></svg>
    //     ), 
    //     title: "Returned" },
    //     { id: 2, 
    //     image1: (<svg width="17" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
    //     ),    
    //     title: "Not Returned" },
    // ]
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl text-black font-bold mb-6">
        Overview
      </h1>

      <div className="flex flex-wrap gap-8">

        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <div className="text-3xl mb-3">
            {totalBooks}
          </div>

          <p className="text-xl font-bold">
            Total Books
          </p>
        </div>

        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <div className="text-3xl mb-3">
            {availableBooks}
          </div>

          <p className="text-xl font-bold">
            Available Books
          </p>
        </div>

        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
          <div className="text-3xl mb-3">
            {borrowedBooks}
          </div>

          <p className="text-xl font-bold">
            Borrowed Books
          </p>
        </div>

        <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
      <h2 className="text-3xl font-bold text-white mt-2">
      {authorCount}
    </h2>
    
    <p className="text-xl font-bold mb-3">
    Total Authors
    </p>
  </div>

    <div className="w-70 h-28 bg-[#0093cde3] p-4 rounded-md text-white">
      <h2 className="text-3xl font-bold text-white mt-2">
      {librarianCount}
    </h2>
    
    
    <p className="text-xl font-bold mb-3">
      Library Attendants
    </p>
  </div>

      </div>

     
      {/* PUT YOUR EXISTING OVERVIEW CARDS HERE */}
    {/* <div className="w-[70%] p-4">
            <div className="text-2xl text-black font-bold mb-6">Overview</div>
            <div className="flex flex-wrap gap-8 h-auto">
                {cards.map((card) => (
                    <div key={card.id} className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                        <div className="text-3xl mb-5">{card.id}</div>
                        <div className='flex gap-2 items-center'>
                        {card.image1 && <div className="mb-2 w-[20px] h-[20px] pt-1">{card.image1}</div>}
                        <p className="text-xl font-bold">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-between text-black mt-4 mb-4'>
                <div>Recent activity</div>
                <div>See all</div>
            </div>

            <div className='flex flex-col gap-2'>
            <div className='flex justify-between p-4 bg-white w-full h-20 rounded-md'>
                <p className='text-black text-xl'>Ebiefie Emmerson</p>

                <div>
                    <div className='text-base font-bold text-[#033803] p-[8px 18px] mb-2'>Successful</div>
                    <div className='text-sm text-[#707070] text-center'>26-06-2026</div>
                </div>
            </div>

            <div className='flex justify-between p-4 bg-white w-full h-20 rounded-md'>
                <p className='text-black text-xl'>Azubuike Ugochi</p>

                <div>
                    <div className='text-base text-red-500 font-bold p-[8px 18px] mb-2'>Failed</div>
                    <div className='text-sm text-[#707070] text-center'>20-06-2026</div>
                </div>
            </div>

            <div className='flex justify-between p-4 bg-white w-full h-20 rounded-md'>
                <p className='text-black text-xl'>Friday Marvellous</p>

                <div>
                    <div className='text-[#033803] text-base font-bold p-[8px 18px] mb-2'>Successful</div>
                    <div className='text-sm text-[#707070] text-center'>17-06-2026</div>
                </div>
            </div>
            </div>
        </div>  */}
      
    </div>
  );
}

export function BorrowBookPage({
  books,
  selectedBook = null,
}: BorrowBookPageProps) {

  const [bookId, setBookId] = useState(
    String(selectedBook?._id ?? selectedBook?.id ?? "")
  );

  const [staffId, setStaffId] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const selected = books.find(
    (book) =>
      String(book._id ?? book.id) === String(bookId)
  );

  useEffect(() => {
    if (selectedBook) {
      setBookId(
        String(
          selectedBook._id ??
          selectedBook.id ??
          ""
        )
      );
    }
  }, [selectedBook]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!bookId) {
      setError("Please select a book.");
      return;
    }

    if (!staffId.trim()) {
      setError("Please enter the Staff ID.");
      return;
    }

    if (!returnDate) {
      setError("Please select a return date.");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await fetch(
        "/api/borrow",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            bookId,
            staffId,
            returnDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to borrow book"
        );
      }

      setSuccess(
        "Book borrowed successfully."
      );

      setBookId("");
      setStaffId("");
      setReturnDate("");

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while borrowing the book."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">

      <h1 className="text-2xl font-bold text-black mb-2">
        Borrow Book
      </h1>

      <p className="text-gray-500 mb-6">
        Select a book and fill in the details below.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* BOOK */}

          <div className="flex flex-col gap-2">

            <label
              htmlFor="book"
              className="text-sm font-semibold text-gray-700"
            >
              Select Book
            </label>

            <select
              id="book"
              value={bookId}
              onChange={(e) =>
                setBookId(e.target.value)
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
            >

              <option value="">
                Select a book
              </option>

              {books
                .filter(
                  (book) =>
                    book.status === "IN"
                )
                .map((book) => {

                  const id = String(
                    book._id ?? book.id
                  );

                  return (
                    <option
                      key={id}
                      value={id}
                    >
                      {book.title}
                    </option>
                  );
                })}

            </select>

          </div>

          {/* SELECTED BOOK */}

          {selected && (
            <div className="p-4 bg-gray-50 rounded-lg">

              <p className="font-bold text-black">
                {selected.title}
              </p>

              <p className="text-sm text-gray-500">
                {selected.author ||
                  "Unknown author"}

                {selected.year &&
                  ` · ${selected.year}`}
              </p>

            </div>
          )}

          {/* STAFF ID */}

          <div className="flex flex-col gap-2">

            <label
              htmlFor="staffId"
              className="text-sm font-semibold text-gray-700"
            >
              Staff ID
            </label>

            <input
              id="staffId"
              type="text"
              placeholder="Enter staff ID"
              value={staffId}
              onChange={(e) =>
                setStaffId(e.target.value)
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
            />

          </div>

          {/* RETURN DATE */}

          <div className="flex flex-col gap-2">

            <label
              htmlFor="returnDate"
              className="text-sm font-semibold text-gray-700"
            >
              Return Date
            </label>

            <input
              id="returnDate"
              type="date"
              min={today}
              value={returnDate}
              onChange={(e) =>
                setReturnDate(e.target.value)
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              ✅ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#0093cde3] text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Confirm Borrow"}
          </button>

        </form>

      </div>

    </div>
  );
}

export function ReturnBookPage({
  books,
  userId,
  onConfirm,
}: ReturnBookPageProps) {

  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // GET BOOKS BORROWED BY CURRENT STUDENT
  // =====================================================

  const myBorrowedBooks = books.filter((book) => {

    // Only show books that are currently OUT
    if (book.status !== "OUT") {
      return false;
    }

    // Must have a borrower
    if (!book.borrowedBy) {
      return false;
    }

    // /api/books returns borrowedBy.id
    const borrowedById =
      typeof book.borrowedBy === "string"
        ? book.borrowedBy
        : book.borrowedBy.id;

    // Compare with logged-in student's MongoDB ID
    return (
      String(borrowedById) ===
      String(userId)
    );
  });

  // =====================================================
  // RETURN BOOK
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!bookId) {
      setError("Please select a book.");
      return;
    }

    try {
      setLoading(true);

      await onConfirm({
        bookId,
      });

      setSuccess(
        "Book returned successfully."
      );

      setBookId("");

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while returning the book."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">

      <h1 className="text-2xl font-bold text-black mb-2">
        Return Book
      </h1>

      <p className="text-gray-500 mb-6">
        Select a book you borrowed.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* SELECT BOOK */}

          <div className="flex flex-col gap-2">

            <label
              htmlFor="book"
              className="text-sm font-semibold text-gray-700"
            >
              Select Book
            </label>

            <select
              id="book"
              value={bookId}
              onChange={(e) =>
                setBookId(e.target.value)
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
            >

              <option value="">
                Select a book to return
              </option>

              {myBorrowedBooks.map((book) => {

                const id = String(
                  book._id ?? book.id
                );

                return (
                  <option
                    key={id}
                    value={id}
                  >
                    {book.title}
                  </option>
                );
              })}

            </select>

          </div>

          {/* NO BORROWED BOOKS */}

          {myBorrowedBooks.length === 0 && (
            <p className="text-sm text-gray-500">
              You currently have no borrowed books.
            </p>
          )}

          {/* ERROR */}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              ✅ {success}
            </div>
          )}

          {/* RETURN BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              !bookId ||
              myBorrowedBooks.length === 0
            }
            className="w-full py-3 rounded-lg bg-[#0093cde3] text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Return Book"}
          </button>

        </form>

      </div>

    </div>
  );
}

export function DashboardPage({
  currentPage,
  onNavigate,
  books,
  userId,
  onReturnBook,
  selectedBook = null,
  authorCount,
  librarianCount,
}: DashboardPageProps) {

  if (currentPage === "overview") {
    return (
      <OverviewPage
        books={books}
        authorCount={authorCount}
        librarianCount={librarianCount}
      />
    );
  }

  if (currentPage === "borrow") {
    return (
      <BorrowBookPage
        books={books}
        selectedBook={selectedBook}
      />
    );
  }

  if (currentPage === "return") {
    return (
      <ReturnBookPage
        books={books}
        userId={userId}
        onConfirm={onReturnBook}
      />
    );
  }

  return null;
}



