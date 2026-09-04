
"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import type { Book } from "../types/book";

export default function MainDashboard() {
  const [userId, setUserId] = useState("");
  const [authorCount, setAuthorCount] = useState(0);
  const [librarianCount, setLibrarianCount] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("No logged-in user found.");
      return;
    }

    try {
      const loggedInUser = JSON.parse(storedUser);

      console.log("LOGGED IN USER:", loggedInUser);

      // We need the MongoDB _id
      const mongoUserId =
        loggedInUser.id ??
        loggedInUser._id ??
        "";

      setUserId(String(mongoUserId));
    } catch (error) {
      console.error(
        "Failed to read logged-in user:",
        error
      );
    }
  }, []);

  // =====================================================
  // FETCH DASHBOARD STATS
  // =====================================================

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(
          "/api/dashboard/stats",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log(
          "DASHBOARD STATS:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch dashboard statistics"
          );
        }

        setAuthorCount(
          data.authorCount ?? 0
        );

        setLibrarianCount(
          data.librarianCount ?? 0
        );
      } catch (error) {
        console.error(
          "ERROR FETCHING DASHBOARD STATS:",
          error
        );
      }
    };

    fetchDashboardStats();
  }, []);

  // =====================================================
  // FETCH BOOKS
  // =====================================================

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/books",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log(
        "BOOKS API STATUS:",
        response.status
      );

      console.log(
        "BOOKS API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch books"
        );
      }

      const fetchedBooks = Array.isArray(data)
        ? data
        : data.data || [];

      console.log(
        "DASHBOARD BOOKS:",
        fetchedBooks
      );

      setBooks(fetchedBooks);
    } catch (error) {
      console.error(
        "Error fetching dashboard books:",
        error
      );
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // =====================================================
  // RETURN BOOK
  // =====================================================

  const handleReturnBook = async ({
    bookId,
  }: {
    bookId: string;
  }) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in again."
      );
    }

    const response = await fetch(
      `/api/return/${encodeURIComponent(bookId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseText =
      await response.text();

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
          "Failed to return book"
      );
    }

    // Update frontend immediately
    setBooks((previousBooks) =>
      previousBooks.map((book) => {
        const currentBookId = String(
          book._id ?? book.id
        );

        if (
          currentBookId === String(bookId)
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
  };

  // =====================================================
  // DASHBOARD LAYOUT
  // =====================================================

  return (
    <div className="">

      {/* SIDEBAR */}

      <div className="w-[300px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}

      <main className="flex-1">
        {/* 
          Your individual dashboard pages
          will be rendered by Next.js routing.

          /dashboard/overview
          /dashboard/borrow
          /dashboard/return
        */}
      </main>

    </div>
  );
}

