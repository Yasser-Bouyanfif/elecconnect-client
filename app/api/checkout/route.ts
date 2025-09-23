import Stripe from "stripe";
import { NextResponse } from "next/server";
import { STRIPE_SECRET_KEY } from "../../lib/serverEnv";

const stripe = new Stripe(STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  const { items } = await request.json();

  const line_items = (items || []).map(
    (item: { title?: string; price?: number; quantity: number }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity,
    })
  );

  const origin = request.headers.get("origin") || "";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
