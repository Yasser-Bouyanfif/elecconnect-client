import { NextResponse } from "next/server";
import { strapiFetch } from "@/app/api/_lib/strapi";

type Params = {
  params: {
    productId: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  try {
    const response = await strapiFetch(
      `/products?filters[id][$eq]=${encodeURIComponent(
        productId
      )}&pagination[pageSize]=1&populate=*`
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Failed to fetch product ${productId}`, error);
    return NextResponse.json(
      { error: "Unable to fetch product" },
      { status: 500 }
    );
  }
}
