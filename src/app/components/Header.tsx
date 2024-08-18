"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SiteLogo from "../../../public/images/header-elephant.webp";
const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="py-2 px-4 flex items-center rounded-2xl hover:bg-neutral-200 transition duration-200"
        >
          <Image
            src={SiteLogo}
            alt="Memoize Logo"
            width={64}
            height={64}
            className="rounded-2xl"
          />
          <h1 className="text-2xl font-bold uppercase">Memoize</h1>
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
          {session && (
            <>
              <Link
                href="/payment"
                className="uppercase py-2 px-4 rounded-xl hover:bg-neutral-200 transition duration-200"
              >
                View Plans
              </Link>
              <Link
                href="/generate"
                className="uppercase py-2 px-4 rounded-xl hover:bg-neutral-200 transition duration-200"
              >
                Create Cards
              </Link>
              <Link
                href="/generate"
                className="uppercase py-2 px-4 rounded-xl hover:bg-neutral-200 transition duration-200"
              >
                Saved Decks
              </Link>
            </>
          )}
          {!session ? (
            <button
              onClick={() => signIn("google", { callbackUrl: "/generate" })}
              className="text-neutral-950 hover:text-blue-600 font-bold py-1 px-4 uppercase"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-neutral-950 hover:text-blue-600 font-bold py-1 px-4 uppercase"
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
