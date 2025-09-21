import { NextResponse } from "next/server";
import { strapiJson } from "@/app/api/_lib/strapi";

type CartItem = {
  id: string | number;
  quantity: number;
};

type StrapiProduct = {
  price?: number;
};

type StrapiProductResponse = {
  data?: StrapiProduct | StrapiProduct[];
};

const extractProduct = (payload: StrapiProductResponse) => {
  const data = payload.data;
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data ?? null;
};

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const totals = await Promise.all(
      items.map(async (item: CartItem) => {
        const id = String(item.id);
        const quantity = Number(item.quantity) || 0;

        if (!id || quantity <= 0) {
          return 0;
        }

        try {
          const { data } = await strapiJson<StrapiProductResponse>(
            `/products?filters[id][$eq]=${encodeURIComponent(
              id
            )}&pagination[pageSize]=1&populate=*`
          );
          const product = extractProduct(data);
          const price = Number(product?.price) || 0;
          return price * quantity;
        } catch (error) {
          console.error(`Failed to fetch product ${id}`, error);
          return 0;
        }
      })
    );

    const total = totals.reduce((sum, val) => sum + val, 0);
    return NextResponse.json({ total });
  } catch (error) {
    console.error("Failed to calculate total", error);
    return NextResponse.json(
      { error: "Failed to calculate total" },
      { status: 500 }
    );
  }
}
