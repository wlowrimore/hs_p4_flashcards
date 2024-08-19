import { Metadata } from "next";

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
    url: "https://memoize.vercel.app",
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

const PaymentSuccess = ({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) => {
  return (
    <main className="w-full flex flex-col py-40 max-w-[80rem] h-screen mx-auto text-neutral-800 text-center">
      <div className="max-w-[30rem] mx-auto lg:border-4 lg:border-white/70 lg:bg-zinc-100/20 md:rounded-full py-36 lg:px-24">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You have successfully sent</h2>
        <div className="bg-white/90 p-2 md:rounded-md text-blue-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
