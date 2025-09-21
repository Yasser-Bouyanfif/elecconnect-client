import { NextResponse } from "next/server";
import productApi from "@/app/strapi/productApis";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const totals = await Promise.all(
      items.map(async (item: { id: string | number; quantity: number }) => {
        const id = String(item.id);
        const quantity = Number(item.quantity) || 0;
        const res = await productApi.getProductById(id);
        const data = res?.data?.data?.[0] ?? res?.data?.data;
        const price = data?.price ?? 0;
        return price * quantity;
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
