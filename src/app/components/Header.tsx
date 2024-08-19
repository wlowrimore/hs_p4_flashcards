"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SiteLogo from "../../../public/images/header-elephant.webp";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="py-2 lg:px-4 flex items-center rounded-2xl hover:bg-neutral-200 transition duration-200"
        >
          <Image
            src={SiteLogo}
            alt="Memoize Logo"
            width={64}
            height={64}
            className="rounded-2xl w-12 h-12 lg:w-16 lg:h-16"
          />
          <h1 className="hidden lg:block text-2xl font-bold uppercase">
            Memoize
          </h1>
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
          {session && (
            <>
              <Link
                href="/payment"
                onClick={() => setIsNavOpen(false)}
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
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden">
          <RxHamburgerMenu size={32} />
        </button>
      </div>
      {/* Mobile menu */}
      {isNavOpen && (
        <div className="md:hidden absolute right-[50%] translate-x-[50%] bg-white w-[90%] h-[22rem] rounded-b-xl">
          <nav className="flex flex-col pt-6 pb-12 space-y-3 items-center">
            <>
              <h2 className="uppercase font-bold text-xl pb-1">Menu</h2>
              <div className="w-[80%] h-[0.025rem] bg-neutral-500 rounded-xl"></div>
              <Link
                href="/payment"
                className="uppercase py-2 px-4 rounded-xl hover:bg-neutral-200 transition duration-200"
              >
                <span onClick={() => setIsNavOpen(!isNavOpen)}>View Plans</span>
              </Link>
              <Link
                href="/generate"
                className="uppercase py-2 px-4 rounded-xl hover:bg-neutral-200 transition duration-200"
              >
                <span onClick={() => setIsNavOpen(!isNavOpen)}>
                  Create Cards
                </span>
              </Link>
              <Link
                href="/generate"
                className="uppercase py-2 px-4 rounded-xl hover:bg-neutral-200 transition duration-200"
              >
                <span onClick={() => setIsNavOpen(!isNavOpen)}>
                  Saved Decks
                </span>
              </Link>
              {session ? (
                <div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="uppercase mt-8"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      signIn("google", { callbackUrl: "/payment" })
                    }
                    className="uppercase mt-8"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
