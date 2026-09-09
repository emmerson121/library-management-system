"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

{/* TYPES */}

interface Author {
  _id?: string;
  id?: string;
  title: string;
  email?: string;
}

interface BookAuthor {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface Book {
  _id?: string;
  id?: string | number;
  title: string;
  isbn?: string;
  authors?: BookAuthor[];
  author?: string;
  genre?: string;
  year?: number;
  cover?: string;
  description?: string;
  status?: "IN" | "OUT";
  available?: boolean;
}

{/* AUTHORS PAGE */}

export default function AuthorsPage() {
  const router = useRouter();

  {/* STATE */}

  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [search, setSearch] = useState("");

  const [selectedAuthorId, setSelectedAuthorId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  {/* FETCH AUTHORS AND BOOKS */}

   useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [authorsResponse, booksResponse] =
          await Promise.all([
            fetch("/api/author", {
              method: "GET",
              cache: "no-store",
            }),

            fetch("/api/books", {
              method: "GET",
              cache: "no-store",
            }),
          ]);

            {/* CHECK AUTHORS RESPONSE */}

        if (!authorsResponse.ok) {
          const text = await authorsResponse.text();

          console.error(
            "AUTHORS API ERROR:",
            authorsResponse.status,
            text
          );

          throw new Error(
            `Failed to load authors (${authorsResponse.status})`
          );
        }

            {/* CHECK BOOKS RESPONSE */}

        if (!booksResponse.ok) {
          const text = await booksResponse.text();

          console.error(
            "BOOKS API ERROR:",
            booksResponse.status,
            text
          );

          throw new Error(
            `Failed to load books (${booksResponse.status})`
          );
        }

            {/* CONVERT RESPONSES TO JSON */}

        const authorsData = await authorsResponse.json();
        const booksData = await booksResponse.json();

        // AUTHORS
        //
        // Your /api/author returns:
        //
        // {
        //   success: true,
        //   count: ...,
        //   authors: [...]
        // }

        if (!authorsData.success) {
          throw new Error(
            authorsData.message || "Failed to load authors"
          );
        }

        if (Array.isArray(authorsData.authors)) {
          setAuthors(authorsData.authors);
        } else {
          setAuthors([]);
        }

        // BOOKS
        //
        // Your books API uses:
        //
        // data: [...]

        if (!booksData.success) {
          throw new Error(
            booksData.message || "Failed to load books"
          );
        }

        if (Array.isArray(booksData.data)) {
          setBooks(booksData.data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error(
          "AUTHORS PAGE FETCH ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading authors."
        );

        // Always keep arrays
        setAuthors([]);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

      {/* GET AUTHOR ID */}

  const getAuthorId = (author: Author): string => {
    return String(author._id || author.id || "");
  };

      {/* GET BOOK ID */}

  const getBookId = (book: Book): string => {
    return String(book._id || book.id || "");
  };

      {/* GET AUTHOR NAME */}

  const getBookAuthorName = (
    author: BookAuthor
  ): string => {
    if (author.title) {
      return author.title;
    }

    if (author.name) {
      return author.name;
    }

    const fullName =
      `${author.firstName || ""} ${
        author.lastName || ""
      }`.trim();

    return fullName;
  };

      {/* SEARCH AUTHORS */}

  const filteredAuthors = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return authors;
    }

    return authors.filter((author) => {
      const title =
        author.title?.toLowerCase() || "";

      const email =
        author.email?.toLowerCase() || "";

      return (
        title.includes(searchValue) ||
        email.includes(searchValue)
      );
    });
  }, [authors, search]);

      {/* SELECTED AUTHOR */}

  const selectedAuthor = useMemo(() => {
    if (!selectedAuthorId) {
      return null;
    }

    return (
      authors.find(
        (author) =>
          getAuthorId(author) === selectedAuthorId
      ) || null
    );
  }, [authors, selectedAuthorId]);

  // BOOKS BELONGING TO SELECTED AUTHOR
  //
  // IMPORTANT:
  // We compare MongoDB AUTHOR IDs.
  //
  // We do NOT compare author names.

  const selectedAuthorBooks = useMemo(() => {
    if (!selectedAuthorId) {
      return [];
    }

    return books.filter((book) => {
      if (
        !Array.isArray(book.authors) ||
        book.authors.length === 0
      ) {
        return false;
      }

      return book.authors.some((bookAuthor) => {
        const bookAuthorId = String(
          bookAuthor._id ||
            bookAuthor.id ||
            ""
        );

        return (
          bookAuthorId === selectedAuthorId
        );
      });
    });
  }, [books, selectedAuthorId]);

      {/* COUNT BOOK FOR AUTHOR */}

  const getBookCount = (
    authorId: string
  ): number => {
    return books.filter((book) => {
      if (
        !Array.isArray(book.authors)
      ) {
        return false;
      }

      return book.authors.some(
        (bookAuthor) => {
          const bookAuthorId = String(
            bookAuthor._id ||
              bookAuthor.id ||
              ""
          );

          return bookAuthorId === authorId;
        }
      );
    }).length;
  };

      {/* BORROW BOOK */}

  const isBookAvailable = (
    book: Book
  ): boolean => {
    if (
      typeof book.available === "boolean"
    ) {
      return book.available;
    }

    return book.status === "IN";
  };

      {/* GET BOOK AUTHORS */} 

  const getBookAuthors = (
    book: Book
  ): string => {
    if (
      Array.isArray(book.authors) &&
      book.authors.length > 0
    ) {
      const names = book.authors
        .map(getBookAuthorName)
        .filter(Boolean);

      if (names.length > 0) {
        return names.join(", ");
      }
    }

    return book.author || "Unknown author";
  };

      {/* BORROW BOOK */}

  const handleAuthorClick = (
    authorId: string
  ) => {
    if (!authorId) {
      return;
    }

    setSelectedAuthorId(authorId);
  };

      {/* BACK TO AUTHORS */}

  const handleBack = () => {
    setSelectedAuthorId(null);
  };

      {/* BORROW BOOK */}

  const handleBorrow = (
    book: Book
  ) => {
    const bookId = getBookId(book);

    if (!bookId) {
      return;
    }

    /*
      We send the selected book ID to the existing
      borrow page.

      Example:

      /dashboard/borrow?bookId=6a8dc6ab28e81814b6ad32c2
    */

    router.push(
      `/dashboard/borrow?bookId=${encodeURIComponent(
        bookId
      )}`
    );
  };

      {/* LOADING */}

  if (loading) {
    return (
      <div className="w-full p-6">
        <div
          data-aos="zoom-out"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
        <div
          className="flex items-center justify-center"
          style={{
            minHeight: "400px",
          }}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">
              ✍️
            </div>

            <p
              className="text-sm font-semibold"
              style={{
                color: "#7c6f99",
              }}
            >
              Loading authors...
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }

      {/* ERROR */}

  if (error) {
    return (
      <div className="w-full p-6">
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "#fff1f1",
            border:
              "1px solid #fecaca",
          }}
        >
          <div className="text-3xl mb-3">
            ⚠️
          </div>

          <h2
            className="font-bold"
            style={{
              color: "#b91c1c",
            }}
          >
            Failed to load authors
          </h2>

          <p
            className="mt-2 text-sm"
            style={{
              color: "#dc2626",
            }}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{
              background: "#0093cde3",
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI

  return (
    <div className="overview">

      {/* HEADER */}
      <div
          data-aos="slide-up-in"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
        <div className="flex justify-between items-center">
      <div className="title">
        Authors
      </div>

      <button 
      type="button"
      onClick={() => router.push("/")}
      className="bg-[#0093cde3] text-white lg:text-sm text-[10px] lg:w-32.5 w-23.75 rounded-md p-2 hover:text-blue mb-6"
      >← Back to Library</button>
      </div>

        <p
          className="text-base text-black mb-4"
        >
          Explore our authors and discover
          books written by your favourite
          authors.
        </p>
      

      {/* AUTHORS LIST */}

      {!selectedAuthor && (
        <>
          {/* SEARCH */}

          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search authors by name or email..."
              className="w-full xl:max-w-195 lg:max-w-145 px-4 py-3 border rounded-xl outline-none text-sm text-black border-gray-500"
            />
          </div>

          {/* COUNT */}

          <div className="mb-5">
            <p
              className="text-sm font-semibold"
              style={{
                color: "#7c6f99",
              }}
            >
              {filteredAuthors.length}{" "}
              {filteredAuthors.length === 1
                ? "author"
                : "authors"}{" "}
              found
            </p>
          </div>

          {/* NO AUTHORS */}

          {filteredAuthors.length === 0 ? (
            <div
              className="p-10 text-center rounded-2xl"
              style={{
                background: "#faf8ff",
                border:
                  "1px solid #ede8f7",
              }}
            >
              <div className="text-xl">
            <svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" fill="white"/></svg>
          </div>

              <p
                className="font-semibold"
                style={{
                  color: "#1e143c",
                }}
              >
                No authors found.
              </p>

              {search && (
                <p
                  className="text-xs mt-2"
                  style={{
                    color: "#7c6f99",
                  }}
                >
                  Try searching with a
                  different name.
                </p>
              )}
            </div>
          ) : (
            /* AUTHOR CARDS */

            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(260px, 1fr))",
              }}
            >
              {filteredAuthors.map(
                (author) => {
                  const authorId =
                    getAuthorId(author);

                  const bookCount =
                    getBookCount(
                      authorId
                    );

                  return (
                    <button
                      key={
                        authorId ||
                        author.title
                      }
                      type="button"
                      onClick={() =>
                        handleAuthorClick(
                          authorId
                        )
                      }
                      disabled={!authorId}
                      className="text-left bg-white rounded-2xl p-6 transition-all hover:-translate-y-1 disabled:opacity-50"
                      style={{
                        border:
                          "1px solid #ede8f7",
                        boxShadow:
                          "0 8px 25px rgba(30,20,60,0.06)",
                      }}
                    >
                      {/* AUTHOR ICON */}

                      <div
                        className="flex items-center justify-center rounded-full mb-5"
                        style={{
                          width: "64px",
                          height: "64px",
                          background:
                            "linear-gradient(135deg, #ede8f7, #ddd6fe)",
                          fontSize: "28px",
                        }}
                      >
                       <div className="text-xl">
            <svg width={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" /></svg>
          </div>
                      </div>

                      {/* AUTHOR NAME */}

                      <h2
                        className="text-lg font-bold"
                        style={{
                          color:
                            "#1e143c",
                          fontFamily:
                            "'Georgia', serif",
                        }}
                      >
                        {author.title}
                      </h2>

                      {/* EMAIL */}

                      {author.email && (
                        <p
                          className="mt-2 text-xs truncate"
                          style={{
                            color:
                              "#7c6f99",
                          }}
                        >
                          {author.email}
                        </p>
                      )}

                      {/* BOOK COUNT */}

                      <div
                        className="mt-5 pt-4"
                        style={{
                          borderTop:
                            "1px solid #ede8f7",
                        }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "#7c5cbf",
                          }}
                        >
                          📚{" "}
                          {bookCount}{" "}
                          {bookCount === 1
                            ? "book"
                            : "books"}
                        </span>

                        <span
                          className="float-right text-xs font-semibold"
                          style={{
                            color:
                              "#0093cde3",
                          }}
                        >
                          View books →
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </>
      )}

      {/* SELECTED AUTHOR */}

      {selectedAuthor && (
        <div>

          {/* BACK */}

          <button
            type="button"
            onClick={handleBack}
            className="mb-6 text-sm font-semibold hover:underline"
            style={{
              color: "#0093cde3",
            }}
          >
            ← Back to Authors
          </button>

          {/* AUTHOR HEADER */}

          <div
            className="mb-6 p-6 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, #1e143c 0%, #3b2a7e 60%, #5b4caf 100%)",
            }}
          >
            <div className="flex items-center gap-4">

              <div
                className="flex items-center justify-center rounded-full text-white font-bold"
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "rgba(255,255,255,0.15)",
                  fontSize: "24px",
                }}
              >
                <div className="text-xl">
            <svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" fill="white"/></svg>
          </div>
              </div>

              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{
                    fontFamily:
                      "'Georgia', serif",
                  }}
                >
                  {selectedAuthor.title}
                </h2>

                {selectedAuthor.email && (
                  <p className="mt-1 text-sm text-purple-200">
                    {selectedAuthor.email}
                  </p>
                )}

                <p className="mt-2 text-xs text-purple-200">
                  {selectedAuthorBooks.length}{" "}
                  {selectedAuthorBooks.length ===
                  1
                    ? "book"
                    : "books"}
                </p>
              </div>

            </div>
          </div>

          {/* AUTHOR BOOKS */}

          {selectedAuthorBooks.length ===
          0 ? (
            <div
              className="p-10 text-center rounded-2xl"
              style={{
                background: "#faf8ff",
                border:
                  "1px solid #ede8f7",
              }}
            >
              <div className="text-5xl mb-4">
                📚
              </div>

              <p
                className="font-semibold"
                style={{
                  color: "#1e143c",
                }}
              >
                No books found for this
                author.
              </p>
            </div>
          ) : (
            <div
              className="grid gap-5 author-card"
            >
              {selectedAuthorBooks.map(
                (book) => {
                  const available =
                    isBookAvailable(
                      book
                    );

                  return (
                    <div
                      key={getBookId(book)}
                      className="bg-white rounded-2xl overflow-hidden"
                      style={{
                        border:
                          "1px solid #ede8f7",
                        boxShadow:
                          "0 8px 25px rgba(30,20,60,0.06)",
                      }}
                    >

                      {/* COVER */}

                      <div
                        className="flex items-center justify-center"
                        style={{
                          height: "190px",
                          background:
                            "linear-gradient(135deg, #ede8f7, #ddd6fe)",
                          fontSize: "55px",
                        }}
                      >
                        {book.cover ||
                          "📖"}
                      </div>

                      {/* CONTENT */}

                      <div className="" style={{padding: "15px"}}>

                        <h3
                          className="font-bold text-lg"
                          style={{
                            color:
                              "#1e143c",
                            fontFamily:
                              "'Georgia', serif",
                          }}
                        >
                          {book.title}
                        </h3>

                        <p
                          className="mt-2 text-sm"
                          style={{
                            color:
                              "#7c6f99",
                          }}
                        >
                          {getBookAuthors(
                            book
                          )}
                        </p>

                        {book.year && (
                          <p className="mt-2 text-xs text-black">
                            Published:{" "}
                            {book.year}
                          </p>
                        )}

                        {book.genre && (
                          <span
                            className="inline-block mt-3 px-3 py-2 rounded-full text-xs font-semibold"
                            style={{
                              background:
                                "#f5f0ff",
                              color:
                                "#7c5cbf",
                            }}
                          >
                            {book.genre}
                          </span>
                        )}

                        {/* STATUS */}

                        <div className="mt-4 flex items-center justify-between gap-3">

                          <span
                            className="text-xs font-bold"
                            style={{
                              color:
                                available
                                  ? "#15803d"
                                  : "#b91c1c",
                            }}
                          >
                            ●{" "}
                            {available
                              ? "AVAILABLE"
                              : "BORROWED"}
                          </span>

                          {/* BORROW */}

                          {available && (
                            <button
                              type="button"
                              onClick={() =>
                                handleBorrow(
                                  book
                                )
                              }
                              className="px-4 py-2 rounded-lg text-white text-xs font-bold hover:opacity-90"
                              style={{
                                background:
                                  "linear-gradient(135deg, #7c5cbf 0%, #5b4caf 100%)",
                              }}
                            >
                              Borrow
                            </button>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

        </div>
      )}
      </div>
    </div>
  );
}

