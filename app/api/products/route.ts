import { NextResponse } from "next/server";

import productApis from "@/app/strapi/productApis";

const PAGE_SIZE = 6;

type StrapiMedia = {
  url?: string | null;
  name?: string | null;
  alternativeText?: string | null;
  data?: { attributes?: StrapiMedia | null } | null;
};

type StrapiProduct = {
  id?: number | string | null;
  title?: string | null;
  price?: number | null;
  description?: string | null;
  banner?: StrapiMedia | null;
  attributes?: StrapiProduct | null;
};

type ProductsResponse = {
  data?: unknown;
  meta?: unknown;
};

const normalizeMedia = (banner?: StrapiMedia | null) => {
  if (!banner) {
    return null;
  }

  if (banner.url || banner.name || banner.alternativeText) {
    return {
      url: banner.url ?? null,
      name: banner.name ?? null,
      alternativeText: banner.alternativeText ?? null,
    };
  }

  const attributes = banner.data?.attributes;

  if (!attributes) {
    return null;
  }

  return {
    url: attributes.url ?? null,
    name: attributes.name ?? null,
    alternativeText: attributes.alternativeText ?? null,
  };
};

const normalizeProduct = (product: StrapiProduct | undefined | null) => {
  if (!product) {
    return null;
  }

  const attributes = product.attributes ?? product;

  return {
    id: product.id ?? attributes?.id ?? null,
    title: attributes?.title ?? null,
    price: attributes?.price ?? null,
    description: attributes?.description ?? null,
    banner: normalizeMedia(attributes?.banner ?? product.banner ?? null),
  };
};

const extractData = (payload: ProductsResponse) => {
  const rawData = payload?.data;

  const arrayData = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

  return arrayData
    .map((item) => normalizeProduct(item as StrapiProduct))
    .filter((item): item is NonNullable<ReturnType<typeof normalizeProduct>> => Boolean(item));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const rawPage = searchParams.get("page");
    const hasPageParam = rawPage !== null;

    const pickData = (payload: ProductsResponse) => ({
      data: extractData(payload),
      meta: payload?.meta ?? null,
    });

    if (hasPageParam) {
      const parsedPage = Number.parseInt(rawPage ?? "", 10);
      const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

      const res = await productApis.getProductsPagination({
        page,
        pageSize: PAGE_SIZE,
      });

      return NextResponse.json(pickData(res?.data ?? {}));
    }

    const res = await productApis.getProducts();

    return NextResponse.json(pickData(res?.data ?? {}));
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Erreur de chargement des produits" },
      { status: 500 }
    );
  }
}
