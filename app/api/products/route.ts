import { NextResponse } from "next/server";
import productApis from "@/app/strapi/productApis";
const PAGE_SIZE = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {

    const rawPage = searchParams.get("page");
    const hasPageParam = rawPage !== null;

    if (hasPageParam) {
      const parsedPage = Number.parseInt(rawPage ?? "", 10);
      const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
      const {data} = await productApis.getProductsPagination({ page, pageSize: PAGE_SIZE });

      return NextResponse.json(data);
    }

    const {data} = await productApis.getProducts();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur de route API :", error);
    return NextResponse.json(
      { error: "Erreur de chargement des produits" },
      { status: 500 }
    );
  }
}
