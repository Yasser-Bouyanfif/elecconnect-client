import { NextResponse } from "next/server";
import Stripe from "stripe";
import axiosClient from "@/app/_utils/axiosClient";
import { LOCAL_URL, STRIPE_SECRET_KEY } from "@/app/lib/constants";

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const id of products) {
      try {
        const res = await axiosClient.get(`/products/${id}?populate=*`);
        const data = res?.data?.data;
        const price = data?.price ?? 0;
        const title = data?.title ?? "Item";
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: { name: title },
            unit_amount: price,
          },
          quantity: 1,
        });
      } catch (e) {
        console.error("Product fetch error", e);
      }
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY || "", {
      apiVersion: "2022-11-15",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${LOCAL_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${LOCAL_URL}/checkout`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create session" },
      { status: 500 }
    );
  }
}
