"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "../../../libs/convertToSubcurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message || "An error occurred");
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An error occurred");
    } else {
      router.push("/generate");
    }
    setIsLoading(false);
  };

  return (
    <main className="my-12 p-12 border border-neutral-400 shadow shadow-neutral-700 bg-[#f5f5f5]/30 rounded-md">
      <form className="w-[18.5rem] md:w-[38.5rem]" onSubmit={handleSubmit}>
        {clientSecret && <PaymentElement />}
        {errorMessage && (
          <div className="text-red-500 text-center p-2 bg-white/80 rounded-3xl">
            {errorMessage}
          </div>
        )}
        <button
          disabled={!stripe || isLoading}
          className="text-white w-full p-5 bg-neutral-800 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse hover:brightness-110 transition duration-200"
        >
          {!isLoading ? `Pay $${amount}` : "Processing..."}
        </button>
      </form>
    </main>
  );
};

export default CheckoutPage;
