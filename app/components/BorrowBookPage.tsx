"use client";

import { useEffect, useMemo, useState } from "react";

interface Book {
  _id?: string;
  id?: string | number;
  title: string;
  author?: string;
  authors?: {
    name?: string;
    firstName?: string;
    lastName?: string;
  }[];
  year?: number;
  genre?: string;
  cover?: string;
  status?: "IN" | "OUT";
  available?: boolean;
}

interface BorrowData {
  bookId: string;
  studentId: string;
  staffId: string;
  returnDate: string;
}

interface BorrowBookPageProps {
  books: Book[];
  onConfirm: (data: BorrowData) => Promise<void> | void;
}

export default function BorrowBookModal({
  books,
  onConfirm,
}: BorrowBookPageProps) {
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [studentId, setStudentId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Only show available books
  const availableBooks = useMemo(() => {
    return books.filter((book) => {
      const available =
        book.available !== undefined
          ? book.available
          : book.status === "IN";

      return available;
    });
  }, [books]);

  // Search books
  const filteredBooks = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return availableBooks;
    }

    return availableBooks.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const genre = book.genre?.toLowerCase() || "";

      const author =
        book.author?.toLowerCase() ||
        book.authors
          ?.map((a) =>
            `${a.firstName || ""} ${a.lastName || ""} ${a.name || ""}`
          )
          .join(" ")
          .toLowerCase() ||
        "";

      return (
        title.includes(searchValue) ||
        author.includes(searchValue) ||
        genre.includes(searchValue)
      );
    });
  }, [availableBooks, search]);

  // Clear search when book is selected
  useEffect(() => {
    if (selectedBook) {
      setSearch("");
    }
  }, [selectedBook]);

  const getBookId = (book: Book) => {
    return String(book._id || book.id || "");
  };

  const getAuthorName = (book: Book) => {
    if (book.author) {
      return book.author;
    }

    if (book.authors && book.authors.length > 0) {
      return book.authors
        .map((author) => {
          if (author.name) return author.name;

          return `${author.firstName || ""} ${
            author.lastName || ""
          }`.trim();
        })
        .filter(Boolean)
        .join(", ");
    }

    return "Unknown author";
  };

  const handleConfirm = async () => {
    setError("");

    if (!selectedBook) {
      setError("Please select a book.");
      return;
    }

    if (!studentId.trim()) {
      setError("Please enter the Student ID.");
      return;
    }

    if (!staffId.trim()) {
      setError("Please enter the Staff / Librarian ID.");
      return;
    }

    if (!returnDate) {
      setError("Please select a return date.");
      return;
    }

    try {
      setLoading(true);

      await onConfirm({
        bookId: getBookId(selectedBook),
        studentId: studentId.trim(),
        staffId: staffId.trim(),
        returnDate,
      });

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

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const labelTextStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#3b2a7e",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1.5px solid #ddd6fe",
    borderRadius: "8px",
    outline: "none",
    fontSize: "13px",
    color: "#1e143c",
    background: "#fff",
  };

  return (
     <div className="w-full p-6">
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        boxShadow: "0 8px 30px rgba(30,20,60,0.08)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(30,20,60,0.3)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1e143c 0%, #3b2a7e 60%, #5b4caf 100%)",
            padding: "24px 28px 20px",
            position: "relative",
          }}
        >
          {/* <button
            disabled={loading}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(255,255,255,0.12)",
              border: "none",
              color: "#fff",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            ✕
          </button> */}

          <div
            style={{
              fontSize: "30px",
              marginBottom: "8px",
            }}
          >
            📚
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontFamily: "'Georgia', serif",
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            Borrow a Book
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#c4b5fd",
              fontSize: "13px",
            }}
          >
            Select a book and provide the borrowing details.
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "22px 28px 28px" }}>
          {/* BOOK SELECTION */}
          {!selectedBook ? (
            <div>
              <label style={labelStyle}>
                <span style={labelTextStyle}>
                  Search for a book
                </span>

                <input
                  type="text"
                  placeholder="Search by title, author or genre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={inputStyle}
                />
              </label>

              <div
                style={{
                  marginTop: "14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#7c6f99",
                }}
              >
                Available books ({filteredBooks.length})
              </div>

              <div
                style={{
                  marginTop: "8px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <button
                      key={getBookId(book)}
                      type="button"
                      onClick={() => setSelectedBook(book)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "1.5px solid #ede8f7",
                        background: "#faf8ff",
                        borderRadius: "10px",
                        padding: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "52px",
                          borderRadius: "6px",
                          background:
                            "linear-gradient(135deg, #ede8f7, #ddd6fe)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "23px",
                          flexShrink: 0,
                        }}
                      >
                        {book.cover || "📖"}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#1e143c",
                            fontSize: "13px",
                          }}
                        >
                          {book.title}
                        </div>

                        <div
                          style={{
                            marginTop: "3px",
                            color: "#7c6f99",
                            fontSize: "11px",
                          }}
                        >
                          {getAuthorName(book)}
                          {book.year ? ` · ${book.year}` : ""}
                        </div>

                        <div
                          style={{
                            marginTop: "5px",
                            color: "#15803d",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          ● AVAILABLE
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "25px 15px",
                      textAlign: "center",
                      color: "#7c6f99",
                      fontSize: "13px",
                      background: "#faf8ff",
                      borderRadius: "10px",
                    }}
                  >
                    No available books found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* SELECTED BOOK */}
              <div
                style={{
                  background: "#f5f0ff",
                  border: "1px solid #ede8f7",
                  borderRadius: "12px",
                  padding: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "58px",
                    borderRadius: "7px",
                    background:
                      "linear-gradient(135deg, #ede8f7, #ddd6fe)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "25px",
                    flexShrink: 0,
                  }}
                >
                  {selectedBook.cover || "📖"}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#1e143c",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    {selectedBook.title}
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      fontSize: "11px",
                      color: "#7c6f99",
                      fontStyle: "italic",
                    }}
                  >
                    {getAuthorName(selectedBook)}
                    {selectedBook.year
                      ? ` · ${selectedBook.year}`
                      : ""}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  disabled={loading}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#7c5cbf",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Change
                </button>
              </div>

              {/* FORM */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <label style={labelStyle}>
                  <span style={labelTextStyle}>
                    Student ID
                  </span>

                  <input
                    type="text"
                    placeholder="e.g. STU-2024-001"
                    value={studentId}
                    onChange={(e) =>
                      setStudentId(e.target.value)
                    }
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>
                    Staff / Librarian ID
                  </span>

                  <input
                    type="text"
                    placeholder="e.g. LIB-007"
                    value={staffId}
                    onChange={(e) =>
                      setStaffId(e.target.value)
                    }
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>
                    Return date
                  </span>

                  <input
                    type="date"
                    value={returnDate}
                    min={today}
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    style={inputStyle}
                  />
                </label>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "10px 14px",
                    background: "#fff1f1",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    color: "#b91c1c",
                    fontSize: "13px",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* CONFIRM */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  background: loading
                    ? "#c4b5fd"
                    : "linear-gradient(135deg, #7c5cbf 0%, #5b4caf 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "Processing..."
                  : "Confirm borrow"}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1.5px solid #ddd6fe",
                  background: "#fff",
                  color: "#7c6f99",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}