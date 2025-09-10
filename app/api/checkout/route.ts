import { NextResponse } from "next/server";
import Stripe from "stripe";
import axiosClient from "@/app/_utils/axiosClient";
import { LOCAL_URL } from "@/app/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const res = await axiosClient.get(`/products/${item.id}`);
      const product = res.data?.data;
      if (!product) continue;
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: product.title },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${LOCAL_URL}/success`,
      cancel_url: `${LOCAL_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
