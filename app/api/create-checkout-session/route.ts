import { NextResponse } from "next/server";
import Stripe from "stripe";
import { LOCAL_URL, API_URL, API_KEY } from "@/app/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const groups: Record<string, number> = {};
    (items as (string | number)[]).forEach((id) => {
      const key = id.toString();
      groups[key] = (groups[key] || 0) + 1;
    });
    const ids = Object.keys(groups);

    const query = ids.map((id) => `filters[id][$in]=${id}`).join("&");
    const productRes = await fetch(
      `${API_URL}/products?${query}&pagination[pageSize]=${ids.length}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );
    const productData = (await productRes.json()) as {
      data: { id: number; attributes: { title: string; price: number } }[];
    };

    const line_items = productData.data.map((p) => ({
      price_data: {
        currency: "eur",
        product_data: { name: p.attributes?.title || "Item" },
        unit_amount: Math.round((p.attributes?.price || 0) * 100),
      },
      quantity: groups[p.id.toString()],
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${LOCAL_URL}/checkout?success=true`,
      cancel_url: `${LOCAL_URL}/checkout?cancelled=true`,
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

