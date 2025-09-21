import { NextResponse } from "next/server";

import productApis from "@/app/strapi/productApis";

const PAGE_SIZE = 6;

type ProductsResponse = {
  data?: unknown;
  meta?: unknown;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const rawPage = searchParams.get("page");
    const hasPageParam = rawPage !== null;

    if (hasPageParam) {
      const parsedPage = Number.parseInt(rawPage ?? "", 10);
      const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

      const res = await productApis.getProductsPagination({ page, pageSize: PAGE_SIZE });
      const payload: ProductsResponse = res?.data ?? {};

      return NextResponse.json({
        data: payload.data ?? [],
        meta: payload.meta ?? null,
      });
    }

    const res = await productApis.getProducts();
    const payload: ProductsResponse = res?.data ?? {};

    return NextResponse.json({
      data: payload.data ?? [],
      meta: payload.meta ?? null,
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Erreur de chargement des produits" },
      { status: 500 }
    );
  }
}
