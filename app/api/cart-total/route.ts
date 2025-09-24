import { NextResponse } from "next/server";
import productApi from "@/app/strapi/productApis";

type CartTotalItem = {
  id: string | number;
  quantity: number;
};

type StrapiProduct = {
  price?: unknown;
  attributes?: {
    price?: unknown;
  };
};

const parsePrice = (product: StrapiProduct | null | undefined): number => {
  const candidates = [product?.price, product?.attributes?.price];

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
};

const normalizeProduct = (response: unknown): StrapiProduct | null => {
  if (!response || typeof response !== "object") {
    return null;
  }

  const data = (response as { data?: unknown }).data;
  if (Array.isArray(data)) {
    return (data[0] as StrapiProduct | undefined) ?? null;
  }

  if (data && typeof data === "object") {
    return data as StrapiProduct;
  }

  return null;
};

const toSafeQuantity = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return parsed;
};

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const totals = await Promise.all(
      items.map(async (item: CartTotalItem) => {
        if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) {
          return 0;
        }

        const quantity = toSafeQuantity(item.quantity);
        if (quantity === 0) {
          return 0;
        }

        const res = await productApi.getProductById(String(item.id));
        const product = normalizeProduct(res?.data ?? null);
        const unitPrice = parsePrice(product);
        return unitPrice * quantity;
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
