"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface PricingTier {
  title: string;
  price: number;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    title: "Free",
    price: 0,
    features: ["Basic features", "Limited cards"],
  },
  {
    title: "Standard",
    price: 9.99,
    features: ["All basic features", "Unlimited cards", "Custom decks"],
  },
  {
    title: "Premium",
    price: 19.99,
    features: ["All features", "Advanced analytics", "Priority support"],
  },
];

function LandingPage() {
  const { data: session } = useSession();
  return (
    <div className="px-8 py-24 min-h-screen">
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-6xl mb-4">Learn Faster, Remember Longer</h2>
        <p className="text-2xl mb-16">
          Master any subject with our powerful flashcard app.
        </p>
        {!session ? (
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="bg-blue-500 hover:bg-blue-700 transition duration-200 text-white font-bold py-2 px-4 rounded"
          >
            Get Started
          </button>
        ) : (
          <Link
            href="/choose-plan"
            className="bg-blue-500 hover:bg-blue-700 transition duration-200 text-white font-bold py-2 px-4 rounded"
          >
            Get Started
          </Link>
        )}
      </section>

      <section className="container flex flex-col items-center mx-auto">
        <article className="w-[60rem] text-neutral-800 text-3xl text-justify">
          Revolutionize your learning with our AI-powered flashcard generator.
          Effortlessly create flashcards tailored to any subject, from academic
          pursuits to professional development. Whether you're a student aiming
          to ace exams or a professional preparing for interviews, our app
          provides an interactive and engaging way to master new information.
          With instant feedback and customizable study sessions, you'll
          accelerate your learning journey and achieve your goals.
        </article>
      </section>
    </div>
  );
}

export default LandingPage;
