import { NextResponse } from "next/server";
import { API_URL, API_KEY } from "@/app/lib/constants";

export async function POST(req: Request) {
  try {
    const { userId, userEmail, items, address } = await req.json();

    const groups: Record<string, number> = {};
    (items as (string | number)[]).forEach((id) => {
      const key = id.toString();
      groups[key] = (groups[key] || 0) + 1;
    });
    const ids = Object.keys(groups);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const query = ids.map((id) => `filters[id][$in]=${id}`).join("&");
    const productRes = await fetch(
      `${API_URL}/products?${query}&pagination[pageSize]=${ids.length}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );
    const productData = (await productRes.json()) as {
      data: { id: number; attributes: { price: number } }[];
    };

    let subTotal = 0;
    productData.data.forEach((p) => {
      const price = p.attributes?.price || 0;
      const qty = groups[p.id.toString()];
      subTotal += price * qty;
    });

    const payload = {
      data: {
        userId,
        userEmail,
        products: ids,
        address,
        shipping: { carrier: "Chronopost", price: 57 },
        subTotal,
        total: subTotal,
        paymentStatus: "paid",
      },
    };

    const orderRes = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      console.error(errText);
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: orderRes.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}

