import Stripe from "stripe";
import { NextResponse } from "next/server";
import { API_URL, API_KEY } from "@/app/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function fetchProduct(id: string | number) {
  const res = await fetch(`${API_URL}/products/${id}?populate=*`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  const json = await res.json();
  return {
    id: json.data?.id,
    title: json.data?.attributes?.title as string,
    price: Number(json.data?.attributes?.price) || 0,
  };
}

export async function POST(request: Request) {
  const { items } = await request.json();
  const entries = Array.isArray(items) ? items : [];

  const products = await Promise.all(
    entries.map((item: { id: string | number }) => fetchProduct(item.id))
  );

  const productMap: Record<string, { title: string; price: number }> = {};
  products.forEach((p) => {
    if (p && p.id) {
      productMap[p.id] = { title: p.title, price: p.price };
    }
  });

  const line_items = entries
    .map((item: { id: string | number; quantity: number }) => {
      const product = productMap[item.id];
      if (!product) return null;
      return {
        price_data: {
          currency: "eur",
          product_data: { name: product.title },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      } as Stripe.Checkout.SessionCreateParams.LineItem;
    })
    .filter(Boolean) as Stripe.Checkout.SessionCreateParams.LineItem[];

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
