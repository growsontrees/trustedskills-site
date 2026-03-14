"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay and Panel */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeMenu}
          />
          {/* Slide-out Panel */}
          <div className="fixed top-0 right-0 h-screen w-64 bg-gray-950 border-l border-gray-800 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-[100] transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <span className="font-semibold text-white">Menu</span>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Navigation Links */}
              <div className="flex flex-col p-4">
                <Link href="/skills" onClick={closeMenu} className="text-gray-300 hover:text-white py-3 border-b border-gray-800 transition-colors">Browse</Link>
                <Link href="/reviews" onClick={closeMenu} className="text-gray-300 hover:text-white py-3 border-b border-gray-800 transition-colors">Reviews</Link>
                <Link href="/submit" onClick={closeMenu} className="text-gray-300 hover:text-white py-3 border-b border-gray-800 transition-colors">Submit</Link>
                <Link href="/docs" onClick={closeMenu} className="text-gray-300 hover:text-white py-3 border-b border-gray-800 transition-colors">Docs</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
