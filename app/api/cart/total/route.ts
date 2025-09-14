import { NextResponse } from "next/server";
import { API_URL, API_KEY } from "@/app/lib/constants";

async function fetchProduct(id: string | number) {
  const res = await fetch(`${API_URL}/products/${id}?populate=*`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  const json = await res.json();
  return {
    id: json.data?.id,
    price: Number(json.data?.attributes?.price) || 0,
  };
}

export async function POST(request: Request) {
  const { items } = await request.json();
  const entries = Array.isArray(items) ? items : [];

  const products = await Promise.all(
    entries.map((item: { id: string | number }) => fetchProduct(item.id))
  );

  const priceMap: Record<string, number> = {};
  products.forEach((p) => {
    if (p && p.id) {
      priceMap[p.id] = p.price;
    }
  });

  const total = entries.reduce((sum, item) => {
    const price = priceMap[item.id];
    return price ? sum + price * item.quantity : sum;
  }, 0);

  return NextResponse.json({ total });
}

