import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import axiosClient from "@/app/_utils/axiosClient";
import { STRIPE_SECRET_KEY, LOCAL_URL } from "@/app/lib/constants";

export const runtime = "nodejs";

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 500 }
    );
  }

  try {
    const { products = [], address, userId, userEmail, shipping } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No products supplied" },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const productResponses = await Promise.all(
      products.map(async (id: number) => {
        try {
          const res = await axiosClient.get(`/products/${id}`);
          return res.data?.data?.attributes;
        } catch (err) {
          console.error("Product fetch error", err);
          return null;
        }
      })
    );

    for (const [index, data] of productResponses.entries()) {
      if (!data?.price) {
        return NextResponse.json(
          { error: `Invalid product id: ${products[index]}` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: Number(data.price),
          product_data: {
            name: data.title || `Product ${products[index]}`,
          },
        },
        quantity: 1,
      });
    }

    if (shipping?.price) {
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: Number(shipping.price),
          product_data: { name: shipping.carrier || "Shipping" },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
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
    const message =
      error instanceof Error ? error.message : "Unable to create Stripe session";
    console.error("Stripe session creation failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
