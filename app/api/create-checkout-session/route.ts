import { NextResponse } from "next/server";
import Stripe from "stripe";
import { LOCAL_URL } from "@/app/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    type Item = { id: string | number; title?: string; price?: number };
    const groups: Record<string, { item: Item; quantity: number }> = {};
    (items as Item[]).forEach((item) => {
      const key = item.id.toString();
      if (groups[key]) {
        groups[key].quantity += 1;
      } else {
        groups[key] = { item, quantity: 1 };
      }
    });

    const line_items = Object.values(groups).map(({ item, quantity }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title || "Item" },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${LOCAL_URL}/cart?success=true`,
      cancel_url: `${LOCAL_URL}/cart?cancelled=true`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create session" },
      { status: 500 }
    );
  }
}

