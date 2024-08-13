"use client";

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <header className="shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase">CardFlash</h1>
        <nav className="hidden md:flex space-x-4">
          <Link href="/features">Features</Link>
          <Link href="/about">About</Link>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </nav>
        <button className="md:hidden" onClick={() => setIsNavOpen(!isNavOpen)}>
          {/* Hamburger icon */}
        </button>
      </div>
      {/* Mobile menu */}
      {isNavOpen && <div className="md:hidden">{/* Mobile menu items */}</div>}
    </header>
  );
};

export default Header;
