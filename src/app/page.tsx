import { Metadata } from "next";
import LandingPage from "./components/LandingPage";

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

export default function Home() {
  return <LandingPage />;
}
