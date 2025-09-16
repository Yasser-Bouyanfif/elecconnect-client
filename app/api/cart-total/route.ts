import { NextResponse } from "next/server";
import productApi from "@/app/_utils/productApis";

type CartTotalRequestItem = { id: string | number; quantity: number };

type CartTotalResponseItem = {
  id: string;
  quantity: number;
  unitPrice: number;
};

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const details = await Promise.all(
      items.map(async (item: CartTotalRequestItem): Promise<CartTotalResponseItem> => {
        const id = String(item.id);
        const quantity = Number(item.quantity) || 0;
        const res = await productApi.getProductById(id);
        const data = res?.data?.data?.[0] ?? res?.data?.data;
        const unitPrice = Number(data?.price) || 0;
        return {
          id,
          quantity,
          unitPrice,
        };
      })
    );

    const total = details.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    return NextResponse.json({ total, items: details });
  } catch (error) {
    console.error("Failed to calculate total", error);
    return NextResponse.json(
      { error: "Failed to calculate total" },
      { status: 500 }
    );
  }
}
