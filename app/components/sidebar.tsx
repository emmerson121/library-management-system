"use client";

import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "@/app/styles.css"

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div>
      

    <aside className="nav-list">    
      <div className="">
      {/* TITLE */}
      <div className="lg:text-[17px] mb-6 font-bold md:text-base text-black">
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
      <div className="text-xl text-[#0093cde3] mb-3">
        LIBRARY
      </div>

      <ul className="mb-6 text-base p-1">

        {/* OVERVIEW */}
        <li className="mb-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/overview")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/overview")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-5 h-5">
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
            <div className="w-5 h-5">
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

      {/* ACTIVITY */}
      <div className="text-xl text-[#0093cde3] mb-3">
        ACTIVITY
      </div>

      <ul className="text-base p-1">

        {/* BORROW BOOK */}
        <li className="mb-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/borrow")}
            className={`flex gap-2 items-center w-full text-left ${
              isActive("/dashboard/borrow")
                ? "text-[#0093cde3] font-bold"
                : "text-gray-600"
            }`}
          >
            <div className="w-5 h-5">
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
            <div className="w-5 h-5">
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
      </div>
    </aside>

      {toggle && (
        <div className="nav-container">
          <div className="navBar">
            <div className="flex justify-between items-center gap-2 mb-6">
              <p className="text-black">Meridian University</p>

              <div>
                <FontAwesomeIcon onClick={() => setToggle(false)} className="close-icon1" icon={faXmark} />
              </div>
            </div>

            <nav className="text-black  p-3">
              <div className="text-xl">Library</div>
            <ul className="mb-3 text-base p-2">
              <li onClick={() => setToggle(false)}>Overview</li>
              <li onClick={() => setToggle(false)}>Authors</li>
            </ul>

            <div className="text-xl">Activity</div>
            <ul className="mb-5 text-base p-2">
              <li>Borrow Book</li>
              <li>Return Book</li>
            </ul>
            </nav>
          </div>
        </div>
      )}

    </div>
  );
}