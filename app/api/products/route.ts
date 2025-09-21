import { NextResponse } from "next/server";

import productApis from "@/app/strapi/productApis";

const PAGE_SIZE = 6;

type ProductsResponse = {
  data?: unknown;
  meta?: unknown;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPage = searchParams.get("page");
  const parsedPage = rawPage ? Number.parseInt(rawPage, 10) : NaN;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  try {
    const res = await productApis.getProducts({ page, pageSize: PAGE_SIZE });
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
