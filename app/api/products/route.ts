import { NextResponse } from "next/server";
import { strapiFetch } from "@/app/api/_lib/strapi";

export async function GET() {
  try {
    const response = await strapiFetch("/products?populate=*");
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json(
      { error: "Unable to fetch products" },
      { status: 500 }
    );
  }
}
