import { NextResponse } from "next/server";
import Stripe from "stripe";
import productApis from "@/app/_utils/productApis";
import { LOCAL_URL } from "@/app/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
})

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const ids = items.map((i: { id: string | number }) => String(i.id));
    const { data } = await productApis.getProductsByIds(ids);
    type Product = { id: string | number; attributes: { price?: number; title?: string } };
    const products: Product[] = data?.data || [];
    const productMap = new Map(
      products.map((p) => [String(p.id), p.attributes])
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const id = String(item.id);
      const quantity = Number(item.quantity) || 1;
      const attributes = productMap.get(id);
      if (!attributes || typeof attributes.price !== "number") {
        return NextResponse.json({ error: "Invalid product" }, { status: 400 });
      }

      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: Math.round(attributes.price * 100),
          product_data: {
            name: attributes.title || "Produit",
          },
        },
        quantity,
      });
    }

    const origin = req.headers.get("origin") || LOCAL_URL || "";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create session" },
      { status: 500 }
    );
  }
}