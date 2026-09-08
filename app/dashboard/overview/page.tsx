"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Book } from "../../types/book";
import "@/app/styles.css";

export default function OverviewPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [authorCount, setAuthorCount] = useState(0);
  const [librarianCount, setLibrarianCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, statsResponse] = await Promise.all([
          fetch("/api/books", {
            cache: "no-store",
          }),
          fetch("/api/dashboard/stats", {
            cache: "no-store",
          }),
        ]);

        const booksData = await booksResponse.json();
        const statsData = await statsResponse.json();

        const fetchedBooks = Array.isArray(booksData)
          ? booksData
          : booksData.data || [];

        setBooks(fetchedBooks);

        setAuthorCount(statsData.authorCount ?? 0);
        setLibrarianCount(statsData.librarianCount ?? 0);
      } catch (error) {
        console.error("Error loading overview:", error);
      }
    };

    fetchData();
  }, []);

  const totalBooks = books.length;

  const borrowedBooks = books.filter(
    (book) => book.status === "OUT"
  ).length;

  const availableBooks = books.filter(
    (book) => book.status === "IN"
  ).length;

  return (
    <div className="overview">
      <div className="flex justify-between items-center">
      <div className=" title">
        Overview
      </div>

      <button 
      type="button"
      onClick={() => router.push("/BookUI")}
      className="bg-[#0093cde3] text-white lg:text-sm text-[10px] lg:w-32.5 md:w-25 w-23.75 rounded-md p-2 hover:text-blue mb-6"
      >← Back to Library</button>
      </div>

      <div className="flex flex-wrap gap-8 lg:gap-10">

        {/* TOTAL BOOKS */}
        <div className="card-holder">
          <div className="md:text-3xl text-xl mb-3">
            {totalBooks}
          </div>

      <div className="flex items-center gap-2 mt-6">
          <div className="lg:text-xl md:text-base">
            📖
            {/* <svg width={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z" fill="white"/></svg> */}
          </div>
          
          <p className="lg:text-xl md:text-base font-bold">
            Total Books
          </p>
          </div>
        </div>

        {/* AVAILABLE BOOKS */}
        <div className="card-holder">
          <div className="md:text-3xl text-xl mb-3">
            {availableBooks}
          </div>

        <div className="flex items-center gap-2 mt-6">
          <div className="lg:text-xl md:text-base">
            📖
            {/* <svg width={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z" fill="white"/></svg> */}
          </div>

          <p className="lg:text-xl md:text-base font-bold">
            Available Books
          </p>
          </div>
        </div>

        {/* BORROWED BOOKS */}
        <div className="card-holder">
          <div className="md:text-3xl text-xl mb-3">
            {borrowedBooks}
          </div>

      <div className="flex items-center gap-2 mt-6">
          <div className="lg:text-xl md:text-base">
            📖
            {/* <svg width={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M386.6 111.5l15.1 249-11-.3c-36.2-.8-71.6 8.8-102.7 28-31-19.2-66.4-28-102.7-28-45.6 0-82.1 10.7-123.5 27.7L93.2 129.6c28.5-11.8 61.5-18.1 92.2-18.1 41.2 0 73.8 13.2 102.7 42.5 27.7-28.3 59-41.7 98.5-42.5zM569.2 448c-25.5 0-47.5-5.2-70.5-15.6-34.3-15.6-70-25-107.9-25-39 0-74.9 12.9-102.7 40.6-27.7-27.7-63.7-40.6-102.7-40.6-37.9 0-73.6 9.3-107.9 25-22.2 9.9-44.7 15.6-69.2 15.6L7 448 49.6 98.9c39.3-22.2 87-34.9 132.3-34.9 37.1 0 75.2 7.7 106.2 29.1 31-21.4 69.2-29.1 106.2-29.1 45.3 0 93 12.6 132.3 34.9L569.2 448zm-43.4-44.7L491.8 123c-30.7-14-67.2-21.4-101-21.4-38.4 0-74.4 12.1-102.7 38.7-28.3-26.6-64.2-38.7-102.7-38.7-33.8 0-70.3 7.4-101 21.4l-34 280.2c47.2-19.5 82.9-33.5 135-33.5 37.6 0 70.8 9.6 102.7 29.6 31.8-20 65.1-29.6 102.7-29.6 52.2 0 87.8 14 135 33.5z" fill="white"/></svg> */}
          </div>
          <p className="lg:text-xl md:text-base font-bold">
            Borrowed Books
          </p>
          </div>
        </div>

        {/* AUTHORS */}
        <div className="card-holder">
          <div className="md:text-3xl text-xl mb-3">
            {authorCount}
          </div>

      <div className="flex items-center gap-2 mt-6">
          <div className="text-xl lg:w-6.25 md:w-5 w-3.75">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" fill="white"/></svg>
          </div>
          <p className="lg:text-xl md:text-base font-bold">
            Total Authors
          </p>
          </div>
        </div>

        {/* LIBRARY ATTENDANTS */}
        <div className="card-holder">
          <div className="md:text-3xl text-xl mb-3">
            {librarianCount}
          </div>


        <div className="flex items-center gap-2 mt-6">
          <div className="text-xl lg:w-7.5 md:w-6.25 w-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z" fill="white"/></svg>
          </div>
          <p className="lg:text-xl md:text-base font-bold">
            Library Attendants
          </p>
          </div>
        </div>

      </div>
    </div>
  );
}