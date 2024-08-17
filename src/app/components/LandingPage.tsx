"use client";

import { useState } from "react";
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
  return (
    <div className="px-8 py-12 min-h-screen">
      {/* Hero section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-6xl mb-4">Learn Faster, Remember Longer</h2>
        <p className="text-2xl mb-8">
          Master any subject with our powerful flashcard app.
        </p>
        <button
          onClick={() => signIn("ggogle", { callbackUrl: "/" })}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </button>
      </section>

      {/* Pricing section */}
      <section className="container mx-auto">
        {/* <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.title}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">{tier.title}</h3>
              <p className="text-4xl font-bold mb-4">${tier.price}/month</p>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
