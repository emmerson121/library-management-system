"use client";

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import type { Book } from "../../types/book";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ReturnBookPage() {
const router = useRouter();
const [books, setBooks] = useState<Book[]>([]);
const [userId, setUserId] = useState("");

const [bookId, setBookId] = useState("");
const [loading, setLoading] = useState(false);
const [fetchingBooks, setFetchingBooks] = useState(true);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

// =====================================================
// GET LOGGED-IN USER
// =====================================================

useEffect(() => {
const storedUser = localStorage.getItem("user");


if (!storedUser) {
  setError("You are not logged in. Please log in again.");
  setFetchingBooks(false);
  return;
}

try {
  const loggedInUser = JSON.parse(storedUser);

  const mongoUserId =
    loggedInUser.id ??
    loggedInUser._id ??
    "";

  if (!mongoUserId) {
    setError("Unable to identify the logged-in user.");
    setFetchingBooks(false);
    return;
  }

  setUserId(String(mongoUserId));
} catch (error) {
  console.error(
    "FAILED TO READ LOGGED-IN USER:",
    error
  );

  setError("Unable to read your login information.");
  setFetchingBooks(false);
}


}, []);

// =====================================================
// FETCH BOOKS
// =====================================================

useEffect(() => {
if (!userId) {
return;
}


const fetchBooks = async () => {
  try {
    setFetchingBooks(true);
    setError("");

    const response = await fetch("/api/books", {
      cache: "no-store",
    });

    const data = await response.json();

    console.log("RETURN PAGE BOOKS RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch books."
      );
    }

    const fetchedBooks = Array.isArray(data)
      ? data
      : data.data || [];

    setBooks(fetchedBooks);
  } catch (error) {
    console.error(
      "ERROR FETCHING RETURN PAGE BOOKS:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Failed to fetch books."
    );
  } finally {
    setFetchingBooks(false);
  }
};

fetchBooks();


}, [userId]);

// =====================================================
// BOOKS BORROWED BY CURRENT STUDENT
// =====================================================

const myBorrowedBooks = books.filter((book) => {
// Book must currently be borrowed
if (book.status !== "OUT") {
return false;
}


// Book must have a borrower
if (!book.borrowedBy) {
  return false;
}

/*
  /api/books returns:

  borrowedBy: {
    id: "...",
    title: "...",
    email: "...",
    studentId: "..."
  }

  But this also safely supports a string ID.
*/

const borrowedById =
  typeof book.borrowedBy === "string"
    ? book.borrowedBy
    : book.borrowedBy?.id;

return (
  String(borrowedById) ===
  String(userId)
);


});

useEffect(() => {
  if (!success && !error) return;

  const timer = setTimeout(() => {
    setSuccess("");
    setError("");
  }, 5000);

  return () => clearTimeout(timer);
}, [success, error]);

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

const token = localStorage.getItem("token");

if (!token) {
  setError(
    "You are not logged in. Please log in again."
  );
  return;
}

try {
  setLoading(true);

  const response = await fetch(
    `/api/return/${encodeURIComponent(bookId)}`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  /*
    Read as text first.

    This prevents:
    Unexpected token '<'

    when Next.js returns an HTML 404 page.
  */

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error(
      "RETURN API DID NOT RETURN JSON:",
      responseText
    );

    throw new Error(
      `Return API returned an invalid response (${response.status}).`
    );
  }

  console.log(
    "RETURN BOOK RESPONSE:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to return book."
    );
  }

  // =================================================
  // SUCCESS
  // =================================================

  setSuccess(
    "Book returned successfully."
  );

  setBookId("");

  /*
    Remove the returned book from the local
    list immediately.
  */

  setBooks((previousBooks) =>
    previousBooks.map((book) => {
      const currentBookId = String(
        book._id ?? book.id
      );

      if (
        currentBookId ===
        String(bookId)
      ) {
        return {
          ...book,
          status: "IN",
          available: true,
          borrowedBy: null,
          issuedBy: null,
          returnDate: null,
        };
      }

      return book;
    })
  );
} catch (error) {
  console.error(
    "RETURN BOOK ERROR:",
    error
  );

  setError(
    error instanceof Error
      ? error.message
      : "Something went wrong while returning the book."
  );
} finally {
  setLoading(false);
}


};

// =====================================================
// PAGE
// =====================================================

return ( <div className="w-full p-6">

  <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#0093cde3] mb-6">
        Return Book
      </h1>

      <button 
      type="button"
      onClick={() => router.push("/BookUI")}
      className="bg-[#0093cde3] text-white lg:text-sm text-[10px] lg:w-32.5 w-23.75 rounded-md p-2 hover:text-blue mb-6"
      >← Back to Library</button>
      </div>

  <p className="text-black mb-6">
    Select a book you borrowed.
  </p>

  <div className="bg-white rounded-xl shadow-sm p-6 max-w-375">

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >

      {/* SELECT BOOK */}

      <div className="flex flex-col gap-2">

        <label
          htmlFor="book"
          className="text-base font-semibold text-gray-700"
        >
          Select Book
        </label>

        <select
          id="book"
          value={bookId}
          onChange={(e) =>
            setBookId(e.target.value)
          }
          disabled={
            fetchingBooks ||
            myBorrowedBooks.length === 0
          }
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3] disabled:bg-gray-100 disabled:cursor-not-allowed"
        >

          <option value="">
            {fetchingBooks
              ? "Loading borrowed books..."
              : "Select a book to return"}
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

      {!fetchingBooks &&
        myBorrowedBooks.length === 0 && (
          <p className="text-sm text-gray-500">
            You currently have no borrowed books.
          </p>
        )}

      {/* SELECTED BOOK */}

      {bookId && (
        (() => {
          const selectedBook =
            myBorrowedBooks.find(
              (book) =>
                String(
                  book._id ?? book.id
                ) === String(bookId)
            );

          if (!selectedBook) {
            return null;
          }

          return (
            <div className="p-4 bg-gray-50 rounded-lg">

              <p className="font-bold text-black">
                {selectedBook.title}
              </p>

              <p className="text-sm text-gray-500">
  {selectedBook.authors?.length
    ? selectedBook.authors
        .map((author) => author.title)
        .filter(Boolean)
        .join(", ")
    : "Unknown author"}

  {selectedBook.year &&
    ` · ${selectedBook.year}`}
</p>

            </div>
          );
        })()
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
          fetchingBooks ||
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
