"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="w-[250px] min-h-screen p-4 text-black bg-white">
      
      {/* TITLE */}
      <div className="text-xl mb-6 font-bold">
        Library Management System
      </div>

      {/* DASHBOARD */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/overview")}
        className={`text-xl mb-6 ${
          pathname.startsWith("/dashboard")
            ? "text-[#0093cde3] font-bold"
            : "text-gray-600"
        }`}
      >
        Dashboard
      </button>

      {/* LIBRARY */}
      <div className="text-base text-[#0093cde3] mb-3">
        LIBRARY
      </div>

      <ul className="mb-6 text-sm p-1">

        {/* OVERVIEW */}
        <li className="mb-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/overview")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/overview")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>

            <span>Overview</span>
          </button>
        </li>

        {/* BOOKS */}
        <li className="mb-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/books")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/books")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M8 6h8M8 10h8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span>Books</span>
          </button>
        </li>

        {/* AUTHORS */}
        <li className="mb-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/authors")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/authors")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                />

                <path
                  d="M5 21c0-3.5 3.1-6 7-6s7 2.5 7 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span>Authors</span>
          </button>
        </li>
      </ul>

      {/* PEOPLE */}
      <div className="text-base text-[#0093cde3] mb-3">
        PEOPLE
      </div>

      <ul className="mb-6 text-sm p-1">

        {/* STUDENTS */}
        <li className="mb-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/students")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/students")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>

            <span>Students</span>
          </button>
        </li>

        {/* LIBRARIANS */}
        <li className="mb-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/librarians")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/librarians")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="7" r="4" />
                <path
                  d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span>Librarians</span>
          </button>
        </li>
      </ul>

      {/* ACTIVITY */}
      <div className="text-base text-[#0093cde3] mb-3">
        ACTIVITY
      </div>

      <ul className="text-sm p-1">

        {/* BORROW BOOK */}
        <li className="mb-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/borrow")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/borrow")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
            </div>

            <span>Borrow Book</span>
          </button>
        </li>

        {/* RETURN BOOK */}
        <li>
          <button
            type="button"
            onClick={() => router.push("/dashboard/return")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/return")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-[20px] h-[20px]">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="#0093cde3"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
            </div>

            <span>Return Book</span>
          </button>
        </li>

      </ul>
    </aside>
  );
}