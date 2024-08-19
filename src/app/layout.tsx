import type { Metadata } from "next";
import { Poppins as Inter } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import SessionWrapper from "@/providers/SessionProvider";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Memoize - A Flashcard Creator",
  description: "AI powered flashcard creator",
  keywords: "AI, flashcard, creator, memoize, nextjs, headstarters, openai",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Memoize - A Flashcard Creator",
    description: "AI powered flashcard creator",
    url: "http://www.williamlowrimore.com",
    siteName: "Memoize - A Flashcard Creator",
    images: [
      {
        url: "/images/site-samples/home.webp",
        width: 800,
        height: 600,
        alt: "William Lowrimore",
        type: "image/webp",
      },
      {
        url: "/images/self.webp",
        width: 320,
        height: 320,
        alt: "William Lowrimore",
        type: "image/webp",
      },
    ],
    locale: "en-US",
    type: "website",
  },
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
            <Footer />
          </main>
        </body>
      </html>
    </SessionWrapper>
  );
}
