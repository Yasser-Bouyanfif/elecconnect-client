import { NextResponse } from "next/server";
import { strapiFetch } from "@/app/api/_lib/strapi";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await strapiFetch("/order-lines", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to create order line", error);
    return NextResponse.json(
      { error: "Unable to create order line" },
      { status: 500 }
    );
  }
}
