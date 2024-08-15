"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase">Memoize</h1>
        <nav className="hidden md:flex space-x-4">
          <Link href="/features">Features</Link>
          <Link href="/about">About</Link>
          {!session ? (
            <button
              onClick={() => signIn("google", { callbackUrl: "/generate" })}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-neutral-950 hover:text-neutral-600 font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          )}
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
