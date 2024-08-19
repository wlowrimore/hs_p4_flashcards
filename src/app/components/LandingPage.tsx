"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface CTA {
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

const features: CTA[] = [
  {
    title: "AI Technology",
    description: "Improve your learning with AI technology",
    imageUrl: "/images/ai.webp",
    alt: "William Lowrimore",
  },
  {
    title: "Budget Friendly",
    description: "Choose the plan that fits your budget",
    imageUrl: "/images/moneybag.webp",
    alt: "William Lowrimore",
  },
  {
    title: "24/7 Support",
    description: "Get support whenever you need it",
    imageUrl: "/images/custsupport.webp",
    alt: "William Lowrimore",
  },
];

function LandingPage() {
  const { data: session } = useSession();
  return (
    <div className="px-8 lg:py-24 min-h-screen">
      <section className="container mx-auto lg:px-4 py-8 lg:py-16 text-center">
        <h2 className="text-3xl font-bold lg:font-normal lg:text-6xl lg:mb-4">
          Learn Faster, Remember Longer
        </h2>
        <p className="text-xl lg:text-2xl mb-8 lg:mb-16">
          Master any subject with our powerful flashcard app.
        </p>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[50rem] gap-4 mx-auto">
          {features.length > 0 &&
            features.map((feature, featIndex) => (
              <div
                key={featIndex}
                className="flex flex-col justify-center items-center max-h-[16rem] p-3 rounded-lg bg-white/40 border border-neutral-200 shadow shadow-neutral-600"
              >
                <h2 className="text-xl font-bold tracking-wide">
                  {feature.title}
                </h2>
                <Image
                  src={feature.imageUrl}
                  alt={feature.alt}
                  width={75}
                  height={75}
                  className="max-h-[5rem] min-h-[5rem]"
                />
                <p className="max-w-[16rem]">{feature.description}</p>
              </div>
            ))}
        </section>
        <section className="mt-12 mb-[-1.7rem]">
          {!session ? (
            <button
              onClick={() => signIn("google", { callbackUrl: "/payment" })}
              className="bg-blue-500 hover:bg-blue-700 transition duration-200 text-white font-bold py-2 px-4 rounded"
            >
              Get Started
            </button>
          ) : (
            <Link
              href="/payment"
              className="bg-blue-500 hover:bg-blue-700 transition duration-200 text-white font-bold py-2 px-4 rounded"
            >
              Get Started
            </Link>
          )}
        </section>
      </section>

      <section className="container flex flex-col items-center mx-auto">
        <article className="min-w-[17rem] max-w-[60rem] text-neutral-800 text-xl lg:text-justify py-8">
          Revolutionize your learning with our AI-powered flashcard generator.
          Effortlessly create flashcards tailored to any subject, from academic
          pursuits to professional development. Whether you&apos;re a student
          aiming to ace exams or a professional preparing for interviews, our
          app provides an interactive and engaging way to master new
          information. With instant feedback and customizable study sessions,
          you&apos;ll accelerate your learning journey and achieve your goals.
        </article>
      </section>
    </div>
  );
}

export default LandingPage;
