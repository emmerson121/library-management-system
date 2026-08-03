"use client"

import { useState, useMemo } from "react";

// --- Types ---
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  available: boolean;
  cover: string; // emoji stand-in
  description: string;
}

// --- Data ---
const BOOKS: Book[] = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic Fiction", year: 1960, available: true, cover: "📖", description: "A gripping tale of racial injustice and childhood innocence in the American South." },
  { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949, available: false, cover: "📕", description: "A chilling portrait of a totalitarian society where Big Brother watches your every move." },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic Fiction", year: 1925, available: true, cover: "📗", description: "A glittering story of wealth, obsession, and the American Dream in the roaring twenties." },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", year: 1813, available: true, cover: "📘", description: "A witty exploration of love, class, and marriage in Regency-era England." },
  { id: 5, title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophy", year: 1988, available: true, cover: "📙", description: "A young shepherd's journey across the desert in pursuit of his personal legend." },
  { id: 6, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", year: 2011, available: false, cover: "📖", description: "A sweeping narrative of humankind's history from the Stone Age to the digital era." },
  { id: 7, title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian", year: 1932, available: true, cover: "📕", description: "A future society built on conditioning, pleasure, and the abolition of individuality." },
  { id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Coming of Age", year: 1951, available: true, cover: "📗", description: "Holden Caulfield's restless, searching journey through New York City." },
  { id: 9, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", year: 2018, available: true, cover: "📘", description: "A practical guide to building good habits and breaking bad ones through tiny changes." },
  { id: 10, title: "The Hitchhiker's Guide", author: "Douglas Adams", genre: "Sci-Fi Comedy", year: 1979, available: false, cover: "📙", description: "An absurdist romp through the universe where the answer is always 42." },
  { id: 11, title: "Think and Grow Rich", author: "Napoleon Hill", genre: "Self-Help", year: 1937, available: true, cover: "📖", description: "Timeless principles of success distilled from interviews with America's wealthiest men." },
  { id: 12, title: "Animal Farm", author: "George Orwell", genre: "Political Satire", year: 1945, available: true, cover: "📕", description: "Farm animals overthrow their farmer in this biting allegory for Soviet communism." },
  { id: 13, title: "The Midnight Library", author: "Matt Haig", genre: "Literary Fiction", year: 2020, available: true, cover: "📗", description: "Between life and death lies a library with books about every life you could have lived." },
  { id: 14, title: "Educated", author: "Tara Westover", genre: "Memoir", year: 2018, available: false, cover: "📘", description: "A woman's extraordinary journey from a survivalist family to Cambridge University." },
  { id: 15, title: "The Power of Now", author: "Eckhart Tolle", genre: "Philosophy", year: 1997, available: true, cover: "📙", description: "A guide to spiritual enlightenment through the practice of present-moment awareness." },
  { id: 16, title: "Normal People", author: "Sally Rooney", genre: "Contemporary Fiction", year: 2018, available: true, cover: "📖", description: "The intense, tender relationship between two Irish students across several years." },
  { id: 17, title: "Becoming", author: "Michelle Obama", genre: "Memoir", year: 2018, available: false, cover: "📕", description: "The former First Lady's memoir tracing her journey from Chicago's South Side to the White House." },
  { id: 18, title: "The Lean Startup", author: "Eric Ries", genre: "Business", year: 2011, available: true, cover: "📗", description: "How modern entrepreneurs use continuous innovation to build successful businesses." },
  { id: 19, title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", year: 1988, available: true, cover: "📘", description: "From the Big Bang to black holes, Hawking explains the cosmos in accessible terms." },
  { id: 20, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937, available: true, cover: "📙", description: "Bilbo Baggins is swept into an epic quest through Middle-earth with a band of dwarves." },
];

const GENRES = ["All", ...Array.from(new Set(BOOKS.map((b) => b.genre))).sort()];
const BOOKS_PER_PAGE = 6;

// --- Components ---
function Badge({ available }: { available: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        background: available ? "#d1fae5" : "#fee2e2",
        color: available ? "#065f46" : "#991b1b",
      }}
    >
      {available ? "Available" : "Borrowed"}
    </span>
  );
}

interface BookCardProps {
  book: Book;
  onBorrow: (id: number) => void;
}

function BookCard({ book, onBorrow }: BookCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "24px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "12px",
        boxShadow: "0 2px 12px rgba(30,20,60,0.07)",
        border: "1px solid #ede8f7",
        transition: "transform 0.15s, box-shadow 0.15s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(90,60,180,0.13)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(30,20,60,0.07)";
      }}
    >
      {/* Cover + Genre */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            fontSize: "42px",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ede8f7 0%, #ddd6fe 100%)",
            borderRadius: "10px",
          }}
        >
          {book.cover}
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#7c5cbf",
            background: "#f3eeff",
            padding: "3px 10px",
            borderRadius: "20px",
            letterSpacing: "0.04em",
          }}
        >
          {book.genre}
        </span>
      </div>

      {/* Title + Author */}
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 700,
            color: "#1e143c",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            lineHeight: 1.3,
          }}
        >
          {book.title}
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#7c6f99", fontStyle: "italic" }}>
          {book.author} · {book.year}
        </p>
      </div>

      {/* Description */}
      <p style={{ margin: 0, fontSize: "13px", color: "#555070", lineHeight: 1.6 }}>
        {book.description}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <Badge available={book.available} />
        <button
          onClick={() => onBorrow(book.id)}
          disabled={!book.available}
          style={{
            padding: "7px 18px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 700,
            fontSize: "13px",
            cursor: book.available ? "pointer" : "not-allowed",
            background: book.available ? "linear-gradient(135deg, #7c5cbf 0%, #5b4caf 100%)" : "#e5e0f0",
            color: book.available ? "#fff" : "#b0a8c8",
            transition: "opacity 0.15s",
            letterSpacing: "0.02em",
          }}
        >
          {book.available ? "Borrow" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}

// --- Main App ---
export default function LibraryApp() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchGenre = genre === "All" || b.genre === genre;
      return matchSearch && matchGenre;
    });
  }, [books, search, genre]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BOOKS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleGenre = (val: string) => {
    setGenre(val);
    setPage(1);
  };

  const handleBorrow = (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, available: false } : b)));
    setNotification(`"${book.title}" has been added to your loans. Return within 14 days.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const availableCount = books.filter((b) => b.available).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2fb", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Notification Toast */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "#1e143c",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(30,20,60,0.25)",
            fontSize: "14px",
            maxWidth: "340px",
            animation: "fadeInDown 0.3s ease",
          }}
        >
          ✅ {notification}
        </div>
      )}

      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #1e143c 0%, #3b2a7e 50%, #5b4caf 100%)",
          color: "#fff",
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "10%", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "6px" }}>
            <span style={{ fontSize: "36px" }}>🏛️</span>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#c4b5fd", fontWeight: 600 }}>
                Meridian University
              </div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, fontFamily: "'Georgia', serif", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                Student Library
              </h1>
            </div>
          </div>
          <p style={{ margin: "16px 0 0", fontSize: "15px", color: "#c4b5fd", maxWidth: "480px", lineHeight: 1.6 }}>
            Browse, search, and borrow from our curated collection. Each loan is valid for 14 days.
          </p>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "28px", marginTop: "28px" }}>
            {[
              { label: "Total Books", value: books.length },
              { label: "Available Now", value: availableCount },
              { label: "Genres", value: GENRES.length - 1 },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>{value}</div>
                <div style={{ fontSize: "12px", color: "#a78bfa", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Search + Filter Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ede8f7", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(30,20,60,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 24px", display: "flex", gap: "12px", flexWrap: "wrap" as const, alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: "200px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by title or author…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                borderRadius: "10px",
                border: "1.5px solid #ddd6fe",
                fontSize: "14px",
                outline: "none",
                color: "#1e143c",
                background: "#faf8ff",
                boxSizing: "border-box" as const,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")}
            />
          </div>

          {/* Genre Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
            {GENRES.slice(0, 6).map((g) => (
              <button
                key={g}
                onClick={() => handleGenre(g)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1.5px solid",
                  borderColor: genre === g ? "#7c5cbf" : "#ddd6fe",
                  background: genre === g ? "#7c5cbf" : "#faf8ff",
                  color: genre === g ? "#fff" : "#7c6f99",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {g}
              </button>
            ))}
            <select
              value={GENRES.slice(6).includes(genre) ? genre : ""}
              onChange={(e) => e.target.value && handleGenre(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1.5px solid #ddd6fe",
                background: "#faf8ff",
                color: "#7c6f99",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="">More genres…</option>
              {GENRES.slice(6).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Results count */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#7c6f99" }}>
            {filtered.length === 0
              ? "No books match your search."
              : `Showing ${(currentPage - 1) * BOOKS_PER_PAGE + 1}–${Math.min(currentPage * BOOKS_PER_PAGE, filtered.length)} of ${filtered.length} book${filtered.length !== 1 ? "s" : ""}`}
          </p>
          {(search || genre !== "All") && (
            <button
              onClick={() => { setSearch(""); setGenre("All"); setPage(1); }}
              style={{ background: "none", border: "none", color: "#7c5cbf", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {/* Book Grid */}
        {paginated.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {paginated.map((book) => (
              <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center" as const, padding: "80px 0", color: "#7c6f99" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>No books found</p>
            <p style={{ fontSize: "14px", margin: "8px 0 0" }}>Try a different search term or genre.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "40px" }}>
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              style={paginationBtnStyle(currentPage === 1)}
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={paginationBtnStyle(currentPage === 1)}
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  ...paginationBtnStyle(false),
                  background: p === currentPage ? "#7c5cbf" : "#fff",
                  color: p === currentPage ? "#fff" : "#1e143c",
                  borderColor: p === currentPage ? "#7c5cbf" : "#ddd6fe",
                  fontWeight: p === currentPage ? 800 : 500,
                  minWidth: "40px",
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={paginationBtnStyle(currentPage === totalPages)}
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              style={paginationBtnStyle(currentPage === totalPages)}
            >
              »
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "60px",
          borderTop: "1px solid #ede8f7",
          padding: "28px 24px",
          textAlign: "center" as const,
          color: "#b0a8c8",
          fontSize: "13px",
          background: "#fff",
        }}
      >
        <span style={{ fontSize: "18px" }}>🏛️</span> Meridian University Library · Open Mon–Fri 8am–9pm, Sat–Sun 10am–6pm
        <span style={{ margin: "0 12px", color: "#ddd6fe" }}>|</span>
        Loans: 14 days · Renewals available at the front desk
      </footer>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// --- Helper ---
function paginationBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1.5px solid #ddd6fe",
    background: "#fff",
    color: disabled ? "#c4b5fd" : "#1e143c",
    fontSize: "14px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.15s",
    minWidth: "40px",
  };
}