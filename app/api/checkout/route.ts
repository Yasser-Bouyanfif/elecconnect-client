import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import axiosClient from "@/app/_utils/axiosClient";
import {
  STRIPE_SECRET_KEY,
  LOCAL_URL,
} from "@/app/lib/constants";

const stripe = new Stripe(STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const { products = [], address, userId, userEmail } = await req.json();

    const lineItems = [] as Stripe.Checkout.SessionCreateParams.LineItem[];

    for (const id of products) {
      const res = await axiosClient.get(`/products/${id}`);
      const data = res.data?.data?.attributes || {};
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: data.price,
          product_data: { name: data.title || `Product ${id}` },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${LOCAL_URL}/success`,
      cancel_url: `${LOCAL_URL}/cart`,
      metadata: {
        userId: userId || "",
        userEmail: userEmail || "",
        address: JSON.stringify(address || {}),
        products: JSON.stringify(products || []),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error(error);
    return new NextResponse("Stripe error", { status: 500 });
  }
}
