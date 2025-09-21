import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import strapiClient from "@/app/api/_lib/strapiClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    if (!params.has("populate")) {
      params.set("populate", "*");
    }

    const endpoint = params.size > 0 ? `/products?${params.toString()}` : "/products";
    const response = await strapiClient.get(endpoint);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch products", error);
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data ?? {
        error: "Failed to fetch products",
      };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
