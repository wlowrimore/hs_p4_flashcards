"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import convertToSubcurrency from "../../../libs/convertToSubcurrency";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "default_stripe_key_here"
);
const PricingComponent = () => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState("");

  const userName = session?.user?.name || "Guest";

  const priceIds = {
    free: "price_free", // Replace with your actual product IDs
    standard: "price_standard",
    premium: "price_premium",
  };

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "default_stripe_key_here"
  );

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      description1: "Generate up to 5 decks/month",
      description2: "enjoy free storage for 30 days",
      buttonText: "Select Plan",
    },
    {
      id: "standard",
      name: "Standard",
      price: 19.99,
      description1: "Generate up to 10 decks/month",
      description2: " enjoy free storage for 90 days.",
      buttonText: "Select Plan",
    },
    {
      id: "premium",
      name: "Premium",
      price: 29.99,
      description1: "Generate up to 15 decks per month",
      description2: "enjoy free storage for 1 year.",
      buttonText: "Select Plan",
    },
  ];

  const price = plans.find((plan) => plan.id === selectedPlan)?.price || 0;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <main className="w-screen min-w-[20rem] max-w-[80rem] min-h-screen mx-auto text-neutral-800 flex flex-col py-12 items-center">
      <h1 className="text-3xl lg:text-4xl flex justify-center w-[38rem] p-2 mb-4 font-bold uppercase">
        Choose Your plan
      </h1>
      {selectedPlan && plans.map((plan) => plan.price) && (
        <p className="text-neutral-700 text-lg px-6 pb-6 lg:pb-0 lg:px-0">
          {userName} has requested the{" "}
          <span className="font-bold capitalize">{selectedPlan}</span> plan for{" "}
          <span className="font-bold">${price}/month</span>.
        </p>
      )}

      <div className="lg:w-full flex flex-col md:flex-row w-[90%] justify-center gap-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan ${selectedPlan === plan.id ? "active" : ""}`}
          >
            <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-semibold mb-2">${plan.price}/month</p>
            <div className="max-w-[13rem] mb-2">
              <p className="">{plan.description1}</p>
              <p className="">{plan.description2}</p>
            </div>
            <button
              onClick={() => handleSelectPlan(plan.id)}
              className="w-full py-1 px-4 font-semibold tracking-wider bg-blue-500 rounded-md text-white"
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
      <section className="w-full flex justify-center">
        <Elements
          stripe={stripePromise}
          options={{
            mode: "subscription",
            amount: convertToSubcurrency(price),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={price} />
        </Elements>
      </section>
    </main>
  );
};

export default PricingComponent;
