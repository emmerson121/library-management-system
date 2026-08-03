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
  cover: string;
  description: string;
}

interface User {
  name: string;
  email: string;
  loans: number[];
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

const registeredUsers: Record<string, { name: string; password: string }> = {};

// --- Auth Modal ---
type AuthMode = "login" | "signup";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = () => {
    setError("");
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "signup") {
        if (registeredUsers[email]) {
          setError("An account with this email already exists.");
          return;
        }
        registeredUsers[email] = { name: name.trim(), password };
        onSuccess({ name: name.trim(), email, loans: [] });
      } else {
        const stored = registeredUsers[email];
        if (!stored || stored.password !== password) {
          setError("Incorrect email or password.");
          return;
        }
        onSuccess({ name: stored.name, email, loans: [] });
      }
    }, 700);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(15, 10, 35, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "420px",
        overflow: "hidden", boxShadow: "0 24px 80px rgba(30,20,60,0.3)",
        animation: "modalIn 0.2s ease",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1e143c 0%, #3b2a7e 60%, #5b4caf 100%)",
          padding: "28px 28px 24px", position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
            width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer",
            fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏛️</div>
          <h2 style={{ margin: 0, color: "#fff", fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 800 }}>
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p style={{ margin: "6px 0 0", color: "#c4b5fd", fontSize: "13px" }}>
            {mode === "login" ? "Sign in to borrow and manage your loans." : "Join Meridian Library to start borrowing books."}
          </p>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #ede8f7" }}>
          {(["login", "signup"] as AuthMode[]).map((m) => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: "14px", border: "none",
              background: mode === m ? "#fff" : "#faf8ff",
              color: mode === m ? "#7c5cbf" : "#b0a8c8",
              fontWeight: mode === m ? 700 : 500, fontSize: "14px", cursor: "pointer",
              borderBottom: mode === m ? "2px solid #7c5cbf" : "2px solid transparent",
              transition: "all 0.15s", textTransform: "capitalize" as const, letterSpacing: "0.02em",
            }}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
            {mode === "signup" && (
              <label style={labelStyle}>
                <span style={labelTextStyle}>Full name</span>
                <input type="text" placeholder="e.g. Ada Lovelace" value={name}
                  onChange={(e) => setName(e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
              </label>
            )}
            <label style={labelStyle}>
              <span style={labelTextStyle}>Email address</span>
              <input type="email" placeholder="you@university.edu" value={email}
                onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Password</span>
              <input type="password"
                placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
            </label>
          </div>

          {error && (
            <div style={{
              marginTop: "14px", padding: "10px 14px", background: "#fff1f1",
              border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "13px",
            }}>⚠️ {error}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            marginTop: "20px", width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: loading ? "#c4b5fd" : "linear-gradient(135deg, #7c5cbf 0%, #5b4caf 100%)",
            color: "#fff", fontWeight: 700, fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.02em",
          }}>
            {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
          </button>

          <p style={{ textAlign: "center" as const, marginTop: "16px", fontSize: "13px", color: "#7c6f99" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              style={{ background: "none", border: "none", color: "#7c5cbf", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "13px" }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// --- Borrow Details Modal ---
interface BorrowModalProps {
  book: Book;
  onClose: () => void;
  onConfirm: (details: { studentId: string; staffId: string; returnDate: string }) => void;
}

function BorrowModal({ book, onClose, onConfirm }: BorrowModalProps) {
  const [studentId, setStudentId] = useState("");
  const [staffId, setStaffId] = useState("");
  const defaultReturn = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  })();
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    setError("");
    if (!studentId.trim()) { setError("Please enter your Student ID."); return; }
    if (!staffId.trim()) { setError("Please enter the Staff / Librarian ID."); return; }
    if (!returnDate) { setError("Please select a return date."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm({ studentId: studentId.trim(), staffId: staffId.trim(), returnDate });
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(15, 10, 35, 0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "440px",
        overflow: "hidden", boxShadow: "0 24px 80px rgba(30,20,60,0.3)", animation: "modalIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e143c 0%, #3b2a7e 60%, #5b4caf 100%)",
          padding: "24px 28px 20px", position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "14px", right: "14px",
            background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
            width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer",
            fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <div style={{ fontSize: "30px", marginBottom: "8px" }}>📋</div>
          <h2 style={{ margin: 0, color: "#fff", fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 800 }}>
            Borrow details
          </h2>
          <p style={{ margin: "6px 0 0", color: "#c4b5fd", fontSize: "13px" }}>
            Fill in the details below to confirm your loan.
          </p>
        </div>

        {/* Book Preview Strip */}
        <div style={{
          padding: "14px 20px", background: "#f5f0ff",
          borderBottom: "1px solid #ede8f7", display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            fontSize: "28px", width: "44px", height: "44px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #ede8f7, #ddd6fe)", borderRadius: "8px",
          }}>{book.cover}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e143c", fontFamily: "'Georgia', serif" }}>
              {book.title}
            </div>
            <div style={{ fontSize: "12px", color: "#7c6f99", fontStyle: "italic" }}>
              {book.author} · {book.year}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "22px 28px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Student ID</span>
              <input type="text" placeholder="e.g. STU-2024-001" value={studentId}
                onChange={(e) => setStudentId(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Staff / Librarian ID</span>
              <input type="text" placeholder="e.g. LIB-007" value={staffId}
                onChange={(e) => setStaffId(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Return date</span>
              <input type="date" value={returnDate} min={today}
                onChange={(e) => setReturnDate(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
            </label>
          </div>

          {error && (
            <div style={{
              marginTop: "14px", padding: "10px 14px", background: "#fff1f1",
              border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "13px",
            }}>⚠️ {error}</div>
          )}

          <button onClick={handleConfirm} disabled={loading} style={{
            marginTop: "20px", width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: loading ? "#c4b5fd" : "linear-gradient(135deg, #7c5cbf 0%, #5b4caf 100%)",
            color: "#fff", fontWeight: 700, fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.02em",
          }}>
            {loading ? "Processing…" : "Confirm borrow"}
          </button>

          <button onClick={onClose} style={{
            marginTop: "10px", width: "100%", padding: "10px", borderRadius: "10px",
            border: "1.5px solid #ddd6fe", background: "#fff", color: "#7c6f99",
            fontSize: "14px", fontWeight: 600, cursor: "pointer",
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "5px" };
const labelTextStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 700, color: "#4a3f72",
  letterSpacing: "0.04em", textTransform: "uppercase",
};
const inputStyle: React.CSSProperties = {
  padding: "10px 14px", borderRadius: "9px", border: "1.5px solid #ddd6fe",
  fontSize: "14px", color: "#1e143c", background: "#faf8ff", outline: "none",
  transition: "border-color 0.15s", width: "100%", boxSizing: "border-box",
};

// --- User Menu ---
interface UserMenuProps {
  user: User;
  loanCount: number;
  onLogout: () => void;
}

function UserMenu({ user, loanCount, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const initials = user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)",
        borderRadius: "40px", padding: "6px 14px 6px 6px", cursor: "pointer",
        color: "#fff", fontSize: "13px", fontWeight: 600,
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: "linear-gradient(135deg, #a78bfa, #7c5cbf)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 800, color: "#fff", flexShrink: 0,
        }}>{initials}</div>
        <span>{user.name.split(" ")[0]}</span>
        {loanCount > 0 && (
          <span style={{
            background: "#f59e0b", color: "#fff", borderRadius: "10px",
            padding: "1px 7px", fontSize: "11px", fontWeight: 800,
          }}>{loanCount}</span>
        )}
        <span style={{ fontSize: "10px", opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "#fff", borderRadius: "14px",
          boxShadow: "0 12px 40px rgba(30,20,60,0.18)", border: "1px solid #ede8f7",
          minWidth: "220px", zIndex: 500, overflow: "hidden",
        }}>
          <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #f3eeff" }}>
            <div style={{ fontWeight: 700, color: "#1e143c", fontSize: "14px" }}>{user.name}</div>
            <div style={{ color: "#7c6f99", fontSize: "12px", marginTop: "2px" }}>{user.email}</div>
          </div>
          <div style={{ padding: "10px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px",
              borderRadius: "8px", background: loanCount > 0 ? "#f5f0ff" : "transparent",
            }}>
              <span style={{ fontSize: "16px" }}>📚</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e143c" }}>
                  {loanCount} active loan{loanCount !== 1 ? "s" : ""}
                </div>
                {loanCount > 0 && <div style={{ fontSize: "11px", color: "#7c6f99" }}>Return within 14 days</div>}
              </div>
            </div>
            <button onClick={() => { setOpen(false); onLogout(); }} style={{
              marginTop: "6px", width: "100%", padding: "9px 10px", borderRadius: "8px",
              border: "none", background: "none", color: "#b91c1c", fontSize: "13px",
              fontWeight: 600, cursor: "pointer", textAlign: "left" as const,
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>🚪</span> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Badge ---
function Badge({ available }: { available: boolean }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
      background: available ? "#d1fae5" : "#fee2e2",
      color: available ? "#065f46" : "#991b1b",
    }}>
      {available ? "Available" : "Borrowed"}
    </span>
  );
}

// --- BookCard ---
interface BookCardProps {
  book: Book;
  isMyLoan: boolean;
  onBorrow: (id: number) => void;
  onReturn: (id: number) => void;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

function BookCard({ book, isMyLoan, onBorrow, onReturn, onAuthRequired, isLoggedIn }: BookCardProps) {
  return (
    <div style={{
      background: "#fff", borderRadius: "14px", padding: "24px",
      display: "flex", flexDirection: "column" as const, gap: "12px",
      boxShadow: "0 2px 12px rgba(30,20,60,0.07)",
      border: isMyLoan ? "1.5px solid #a78bfa" : "1px solid #ede8f7",
      transition: "transform 0.15s, box-shadow 0.15s", position: "relative" as const,
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
      {isMyLoan && (
        <div style={{
          position: "absolute", top: "12px", right: "12px", background: "#7c5cbf", color: "#fff",
          fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em",
          padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" as const,
        }}>My Loan</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          fontSize: "42px", width: "60px", height: "60px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #ede8f7 0%, #ddd6fe 100%)", borderRadius: "10px",
        }}>{book.cover}</div>
        <span style={{
          fontSize: "11px", fontWeight: 600, color: "#7c5cbf", background: "#f3eeff",
          padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.04em",
          marginRight: isMyLoan ? "68px" : "0",
        }}>{book.genre}</span>
      </div>

      <div>
        <h3 style={{
          margin: 0, fontSize: "16px", fontWeight: 700, color: "#1e143c",
          fontFamily: "'Georgia', 'Times New Roman', serif", lineHeight: 1.3,
        }}>{book.title}</h3>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#7c6f99", fontStyle: "italic" }}>
          {book.author} · {book.year}
        </p>
      </div>

      <p style={{ margin: 0, fontSize: "13px", color: "#555070", lineHeight: 1.6 }}>
        {book.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <Badge available={book.available} />
        {isMyLoan ? (
          <button onClick={() => onReturn(book.id)} style={{
            padding: "7px 18px", borderRadius: "8px", border: "1.5px solid #7c5cbf",
            fontWeight: 700, fontSize: "13px", cursor: "pointer", background: "#fff", color: "#7c5cbf",
          }}>Return</button>
        ) : (
          <button
            onClick={() => isLoggedIn ? onBorrow(book.id) : onAuthRequired()}
            disabled={!book.available}
            style={{
              padding: "7px 18px", borderRadius: "8px", border: "none",
              fontWeight: 700, fontSize: "13px",
              cursor: book.available ? "pointer" : "not-allowed",
              background: book.available
                ? "linear-gradient(135deg, #7c5cbf 0%, #5b4caf 100%)"
                : "#e5e0f0",
              color: book.available ? "#fff" : "#b0a8c8",
              letterSpacing: "0.02em",
            }}
          >
            {book.available ? (isLoggedIn ? "Borrow" : "🔒 Borrow") : "Unavailable"}
          </button>
        )}
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
  const [notification, setNotification] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [borrowingBook, setBorrowingBook] = useState<Book | null>(null);

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

  const showNotification = (text: string, type: "success" | "info" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Opens the BorrowModal instead of borrowing immediately
  const handleBorrowClick = (id: number) => {
    if (!user) { setShowAuth(true); return; }
    const book = books.find((b) => b.id === id);
    if (book) setBorrowingBook(book);
  };

  // Called when the user confirms the borrow details form
  const handleBorrowConfirm = (details: { studentId: string; staffId: string; returnDate: string }) => {
    if (!borrowingBook) return;
    setBooks((prev) => prev.map((b) => b.id === borrowingBook.id ? { ...b, available: false } : b));
    setUser((prev) => prev ? { ...prev, loans: [...prev.loans, borrowingBook.id] } : prev);
    const formatted = new Date(details.returnDate + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
    showNotification(`"${borrowingBook.title}" added to your loans. Return by ${formatted}.`);
    setBorrowingBook(null);
  };

  const handleReturn = (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    setBooks((prev) => prev.map((b) => b.id === id ? { ...b, available: true } : b));
    setUser((prev) => prev ? { ...prev, loans: prev.loans.filter((l) => l !== id) } : prev);
    showNotification(`"${book.title}" has been returned. Thank you!`, "info");
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuth(false);
    showNotification(`Welcome, ${loggedInUser.name.split(" ")[0]}! You can now borrow books.`);
  };

  const handleLogout = () => {
    if (user && user.loans.length > 0) {
      setBooks((prev) => prev.map((b) => user.loans.includes(b.id) ? { ...b, available: true } : b));
    }
    setUser(null);
    showNotification("You've been logged out.", "info");
  };

  const availableCount = books.filter((b) => b.available).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2fb", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}

      {/* Borrow Details Modal */}
      {borrowingBook && (
        <BorrowModal
          book={borrowingBook}
          onClose={() => setBorrowingBook(null)}
          onConfirm={handleBorrowConfirm}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 1000,
          background: notification.type === "info" ? "#3b2a7e" : "#1e143c", color: "#fff",
          padding: "14px 22px", borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(30,20,60,0.25)", fontSize: "14px", maxWidth: "340px",
          animation: "fadeInDown 0.3s ease", display: "flex", alignItems: "flex-start", gap: "10px",
        }}>
          <span>{notification.type === "info" ? "ℹ️" : "✅"}</span>
          <span>{notification.text}</span>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #1e143c 0%, #3b2a7e 50%, #5b4caf 100%)",
        color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "36px" }}>🏛️</span>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#c4b5fd", fontWeight: 600 }}>
                  Meridian University
                </div>
                <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, fontFamily: "'Georgia', serif", lineHeight: 1.1 }}>
                  Student Library
                </h1>
              </div>
            </div>
            {user ? (
              <UserMenu user={user} loanCount={user.loans.length} onLogout={handleLogout} />
            ) : (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={() => setShowAuth(true)} style={{
                  padding: "9px 20px", borderRadius: "40px", border: "1.5px solid rgba(255,255,255,0.35)",
                  background: "transparent", color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                }}>Log In</button>
                <button onClick={() => setShowAuth(true)} style={{
                  padding: "9px 20px", borderRadius: "40px", border: "none",
                  background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer",
                }}>Sign Up</button>
              </div>
            )}
          </div>

          <p style={{ margin: "16px 0 0", fontSize: "15px", color: "#c4b5fd", maxWidth: "480px", lineHeight: 1.6 }}>
            Browse, search, and borrow from our curated collection. Each loan is valid for 14 days.
          </p>

          <div style={{ display: "flex", gap: "28px", marginTop: "24px" }}>
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

        {!user && (
          <div style={{ background: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 24px" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
              <span style={{ fontSize: "14px" }}>🔒</span>
              <span style={{ color: "#c4b5fd", fontSize: "13px" }}>
                You're browsing as a guest.{" "}
                <button onClick={() => setShowAuth(true)} style={{ background: "none", border: "none", color: "#a78bfa", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "13px", textDecoration: "underline" }}>
                  Log in or sign up
                </button>
                {" "}to borrow books.
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Search + Filter Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ede8f7", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(30,20,60,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 24px", display: "flex", gap: "12px", flexWrap: "wrap" as const, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: "200px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
            <input type="text" placeholder="Search by title or author…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: "10px", border: "1.5px solid #ddd6fe", fontSize: "14px", outline: "none", color: "#1e143c", background: "#faf8ff", boxSizing: "border-box" as const }}
              onFocus={(e) => (e.target.style.borderColor = "#7c5cbf")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")} />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
            {GENRES.slice(0, 6).map((g) => (
              <button key={g} onClick={() => { setGenre(g); setPage(1); }} style={{
                padding: "8px 16px", borderRadius: "20px", border: "1.5px solid",
                borderColor: genre === g ? "#7c5cbf" : "#ddd6fe",
                background: genre === g ? "#7c5cbf" : "#faf8ff",
                color: genre === g ? "#fff" : "#7c6f99",
                fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const,
              }}>{g}</button>
            ))}
            <select value={GENRES.slice(6).includes(genre) ? genre : ""}
              onChange={(e) => e.target.value && (setGenre(e.target.value), setPage(1))}
              style={{ padding: "8px 12px", borderRadius: "20px", border: "1.5px solid #ddd6fe", background: "#faf8ff", color: "#7c6f99", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              <option value="">More genres…</option>
              {GENRES.slice(6).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#7c6f99" }}>
            {filtered.length === 0
              ? "No books match your search."
              : `Showing ${(currentPage - 1) * BOOKS_PER_PAGE + 1}–${Math.min(currentPage * BOOKS_PER_PAGE, filtered.length)} of ${filtered.length} book${filtered.length !== 1 ? "s" : ""}`}
          </p>
          {(search || genre !== "All") && (
            <button onClick={() => { setSearch(""); setGenre("All"); setPage(1); }}
              style={{ background: "none", border: "none", color: "#7c5cbf", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
              Clear filters ✕
            </button>
          )}
        </div>

        {paginated.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {paginated.map((book) => (
              <BookCard key={book.id} book={book}
                isMyLoan={!!user && user.loans.includes(book.id)}
                isLoggedIn={!!user}
                onBorrow={handleBorrowClick}
                onReturn={handleReturn}
                onAuthRequired={() => setShowAuth(true)} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center" as const, padding: "80px 0", color: "#7c6f99" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>No books found</p>
            <p style={{ fontSize: "14px", margin: "8px 0 0" }}>Try a different search term or genre.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "40px" }}>
            <button onClick={() => setPage(1)} disabled={currentPage === 1} style={paginationBtnStyle(currentPage === 1)}>«</button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={paginationBtnStyle(currentPage === 1)}>‹ Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{
                ...paginationBtnStyle(false),
                background: p === currentPage ? "#7c5cbf" : "#fff",
                color: p === currentPage ? "#fff" : "#1e143c",
                borderColor: p === currentPage ? "#7c5cbf" : "#ddd6fe",
                fontWeight: p === currentPage ? 800 : 500,
                minWidth: "40px",
              }}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={paginationBtnStyle(currentPage === totalPages)}>Next ›</button>
            <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} style={paginationBtnStyle(currentPage === totalPages)}>»</button>
          </div>
        )}
      </main>

      <footer style={{
        marginTop: "60px", borderTop: "1px solid #ede8f7", padding: "28px 24px",
        textAlign: "center" as const, color: "#b0a8c8", fontSize: "13px", background: "#fff",
      }}>
        <span style={{ fontSize: "18px" }}>🏛️</span> Meridian University Library · Open Mon–Fri 8am–9pm, Sat–Sun 10am–6pm
        <span style={{ margin: "0 12px", color: "#ddd6fe" }}>|</span>
        Loans: 14 days · Renewals available at the front desk
      </footer>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function paginationBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #ddd6fe", background: "#fff",
    color: disabled ? "#c4b5fd" : "#1e143c", fontSize: "14px", fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    minWidth: "40px",
  };
}