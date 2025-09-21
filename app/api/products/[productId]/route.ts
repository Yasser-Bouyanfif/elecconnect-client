import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import strapiClient from "@/app/api/_lib/strapiClient";

interface RouteParams {
  params: { productId: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json(
      { error: "Product id is required" },
      { status: 400 }
    );
  }

  try {
    const response = await strapiClient.get(
      `/products?filters[id][$eq]=${productId}&pagination[pageSize]=1&populate=*`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Failed to fetch product ${productId}`, error);
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data ?? {
        error: "Failed to fetch product",
      };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
