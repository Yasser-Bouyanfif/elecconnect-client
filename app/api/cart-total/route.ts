import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import strapiClient from "@/app/api/_lib/strapiClient";

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
        const response = await strapiClient.get(
          `/products?filters[id][$eq]=${id}&pagination[pageSize]=1&populate=*`
        );
        const data = response?.data?.data?.[0] ?? response?.data?.data;
        const price = data?.price ?? 0;
        return price * quantity;
      })
    );

    const total = totals.reduce((sum, val) => sum + val, 0);
    return NextResponse.json({ total });
  } catch (error) {
    console.error("Failed to calculate total", error);
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data ?? {
        error: "Failed to calculate total",
      };
      return NextResponse.json(message, { status });
    }
    return NextResponse.json(
      { error: "Failed to calculate total" },
      { status: 500 }
    );
  }
}
