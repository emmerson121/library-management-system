"use client";

import { useState } from "react";

interface ReturnData {
  bookId: string;
  studentId: string;
  staffId: string;
}

interface ReturnBookPageProps {
  onConfirm: (
    data: ReturnData
  ) => Promise<void> | void;
}

export default function ReturnBookPage({
  onConfirm,
}: ReturnBookPageProps) {
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [staffId, setStaffId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!bookId.trim()) {
      setError("Please enter the Book ID.");
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

    try {
      setLoading(true);

      await onConfirm({
        bookId: bookId.trim(),
        studentId: studentId.trim(),
        staffId: staffId.trim(),
      });

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

      <div className="max-w-[800px] mx-auto">

        <div className="mb-6">
          <div className="text-2xl font-bold text-black">
            Return Book
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Enter the details below to return a borrowed book.
          </p>
        </div>


        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex flex-col gap-5">

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-[#3b2a7e]">
                Book ID
              </span>

              <input
                type="text"
                placeholder="Enter Book ID"
                value={bookId}
                onChange={(e) =>
                  setBookId(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              />
            </label>


            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-[#3b2a7e]">
                Student ID
              </span>

              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              />
            </label>


            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-[#3b2a7e]">
                Staff / Librarian ID
              </span>

              <input
                type="text"
                placeholder="Enter Staff ID"
                value={staffId}
                onChange={(e) =>
                  setStaffId(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              />
            </label>

          </div>


          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}


          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full p-3 rounded-lg text-white font-bold bg-[#0093cde3] disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Confirm Return"}
          </button>

        </div>

      </div>

    </div>
  );
}