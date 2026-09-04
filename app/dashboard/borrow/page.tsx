"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";
import type { Book } from "../../types/book";
import AOS from "aos";
import "aos/dist/aos.css"


function BorrowBookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBookId = searchParams.get("bookId") ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [bookId, setBookId] = useState(selectedBookId);

  const [staffId, setStaffId] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH BOOKS
  // =====================================================

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);

        const response = await fetch(
          "/api/books",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch books"
          );
        }

        const fetchedBooks =
          Array.isArray(data)
            ? data
            : data.data || [];

        setBooks(fetchedBooks);
      } catch (error) {
        console.error(
          "ERROR FETCHING BOOKS:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch books"
        );
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Initialize AOS
   useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);


  // =====================================================
  // SET BOOK FROM URL
  // =====================================================

  useEffect(() => {
    if (selectedBookId) {
      setBookId(selectedBookId);
    }
  }, [selectedBookId]);

  // =====================================================
  // SELECTED BOOK
  // =====================================================

  const selectedBook = books.find(
    (book) =>
      String(book._id ?? book.id) === String(bookId)
  );

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

    const getAuthorName = (book: Book) => {
  if (book.authors && book.authors.length > 0) {
    return book.authors
      .map((author) => author.title)
      .filter(Boolean)
      .join(", ");
  }

  if (book.author) {
    return book.author;
  }

  return "Unknown author";
};

// clear notifications
useEffect(() => {
  if (!success && !error) return;

  const timer = setTimeout(() => {
    setSuccess("");
    setError("");
  }, 5000);

  return () => clearTimeout(timer);
}, [success, error]);


  // =====================================================
  // SUBMIT BORROW
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

    if (!staffId.trim()) {
      setError(
        "Please enter the Staff ID."
      );
      return;
    }

    if (!returnDate) {
      setError(
        "Please select a return date."
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please log in again."
        );
      }

      const response = await fetch(
        "/api/borrow",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
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
  const errorMessage = data.message || "";

  if (
    errorMessage.toLowerCase().includes("jwt expired") ||
    errorMessage.toLowerCase().includes("token expired")
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    localStorage.setItem(
    "pendingBorrowBookId",
    bookId
  );

    setError("Session expired, login to borrow book");

    setTimeout(() => {
      router.push("/login");
    }, 1500);

    return;
  }

  throw new Error(
    errorMessage || "Failed to borrow book"
  );
}

      setSuccess(
        "Book borrowed successfully."
      );

      // Clear form
      setBookId("");
      setStaffId("");
      setReturnDate("");

      // Refresh books so the borrowed
      // book is no longer available.
      const booksResponse =
        await fetch("/api/books", {
          cache: "no-store",
        });

      const booksData =
        await booksResponse.json();

      if (booksResponse.ok) {
        const updatedBooks =
          Array.isArray(booksData)
            ? booksData
            : booksData.data || [];

        setBooks(updatedBooks);
      }
    } catch (error) {
      console.error(
        "BORROW BOOK ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while borrowing the book."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="w-full p-6">
      <div
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#0093cde3] mb-6">
        Borrow Book
      </h1>

      <button 
      type="button"
      onClick={() => router.push("/BookUI")}
      className="bg-[#0093cde3] text-white lg:text-sm text-[10px] lg:w-32.5 w-23.75 rounded-md p-2 hover:text-blue mb-6"
      >← Back to Library</button>
      </div>

      <p className="text-black mb-6">
        Select a book and fill in the details below.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-375">

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
              disabled={booksLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3] disabled:opacity-50"
            >

              <option value="">
                {booksLoading
                  ? "Loading books..."
                  : "Select a book"}
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

          {selectedBook && (
            <div className="p-4 bg-gray-50 rounded-lg">

              <p className="font-bold text-black">
                {selectedBook.title}
              </p>

              <p className="text-sm text-gray-500">
  {getAuthorName(selectedBook)}

  {selectedBook.year &&
    ` · ${selectedBook.year}`}
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
              placeholder="Enter Staff ID"
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

          {/* BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              booksLoading
            }
            className="w-full py-3 rounded-lg bg-[#0093cde3] text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Confirm Borrow"}
          </button>

        </form>

      </div>
        </div>
    </div>
  );
}

export default function BorrowBookPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <BorrowBookContent />
    </Suspense>
  );
}

