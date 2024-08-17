import type { Metadata } from "next";
import { Poppins as Inter } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import SessionWrapper from "@/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en" className="">
        <body className={inter.className}>
          <Header />
          <main className="bg-gradient-to-tr from-amber-400 to-blue-700/50">
            {children}
          </main>
        </body>
      </html>
    </SessionWrapper>
  );
}
