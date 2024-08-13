import { NextResponse } from "next/server";
import Stripe from "stripe";

const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion:
    "2024-06-20",
});

export async function POST(req) {
  try {
    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: 2000,
          quantity: 1,
        },
      ],
      unit_amount: formatAmountForStripe(20, 'usd'),
      success_url: `${req.headers.get(
        "Referer"
      )}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        "Referer"
      )}relult?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession,
      {
        status: 200,
      });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new NextResponse(
      JSON.stringify({ error: { message: error.message } })
    );
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try {
    if (!session_id) {
      throw new Error('Session ID is required')
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}