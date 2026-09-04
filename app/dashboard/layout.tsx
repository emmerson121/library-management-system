"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
// import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "../styles.css";
import AOS from "aos";
import "aos/dist/aos.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function DashboardLayout({
  
  children,
}: {
  children: React.ReactNode;
}) 
{
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
  AOS.init({
    duration: 1000,
    once: true,
  });
}, []);
  
  return (
    <div className="container">
      
      {/* CONSTANT SIDEBAR */}
      <aside className="sideBar">
        <Sidebar />
      </aside>

      {/* PAGE CONTENT */}
      
      <main className="flex-1">
 
        <div className="navbar">
      <div className=" w-full flex justify-between items-center gap-2">
        <p className="text-white text-xl font-bold">Meridian University</p>

        <div className="nav-icon">
        <FontAwesomeIcon
    icon={faBars}
    className="nav-icon1"
    onClick={() => {
        setToggle(true);
    }}
/>
    </div>
      </div>

      
      </div>
      <div
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
        {children}
        </div>
      </main>
      

      {toggle && (
        <div className="nav-container">
          <div className="navBar">
            <div className="flex justify-between items-center gap-2 mb-4">
              <p className="text-white text-2xl">Meridian University</p>

              <div className="close-icon">
                <FontAwesomeIcon onClick={() => setToggle(false)} className="close-icon1" icon={faXmark} />
              </div>
            </div>

            <nav className="text-white  p-3">
              <div className="text-xl">Library</div>
            <ul className="mb-3 text-base p-2 leading-8">
              <li onClick={() => setToggle(false)} className="flex gap-2 items-center w-full text-left">
                <div className="w-5 h-5">
              <svg
                width="17"
                height="17"
                fill="white"
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
                <Link href="/dashboard/overview">Overview</Link></li>
              <li onClick={() => setToggle(false)} className="flex gap-2 items-center w-full text-left">
                <div className="w-5 h-5">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="white"
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
                <Link href="/dashboard/authors">Authors</Link></li>
            </ul>

            <div className="text-xl">Activity</div>
            <ul className="mb-5 text-base p-2 leading-8">
              <li onClick={() => setToggle(false)} className="flex gap-2 items-center w-full text-left">
                <div className="w-5 h-5">
              <svg
                width="17"
                height="17"
                fill="white"
                stroke="white"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
            </div>
                <Link href="/dashboard/borrow">Borrow Book</Link></li>
              <li onClick={() => setToggle(false)} className="flex gap-2 items-center w-full text-left">
                <div className="w-5 h-5">
              <svg
                width="17"
                height="17"
                fill="white"
                stroke="white"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
            </div>
                <Link href="/dashboard/return">Return Book</Link></li>
            </ul>
            </nav>
          </div>
        </div>
      )}

    </div>
  );
}